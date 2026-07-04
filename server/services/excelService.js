const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { downloadFileBuffer } = require("./driveService");

const CACHE_PATH = path.resolve(__dirname, "..", "data", "cache.json");

// In-memory cache. Also mirrored to disk so a server restart doesn't
// start with an empty dashboard before the first manual refresh.
let cache = {
  lastSynced: null,
  employees: [],
  stores: [],
  brands: [],
  sales: [],
};

function loadCacheFromDisk() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    }
  } catch (err) {
    console.warn("Could not read local cache, starting empty:", err.message);
  }
}

function saveCacheToDisk() {
  try {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.warn("Could not write local cache:", err.message);
  }
}

function sheetToJson(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

// normalizes header casing/spacing so "Store ID", "store_id", "storeid" all work
function normalizeRow(row) {
  const out = {};
  for (const key of Object.keys(row)) {
    const normalized = key.trim().toLowerCase().replace(/\s+/g, "_");
    out[normalized] = row[key];
  }
  return out;
}

async function refreshFromDrive() {
  const employeesFileId = process.env.DRIVE_EMPLOYEES_FILE_ID;
  const salesFileId = process.env.DRIVE_SALES_FILE_ID;

  if (!employeesFileId || !salesFileId) {
    throw new Error("DRIVE_EMPLOYEES_FILE_ID / DRIVE_SALES_FILE_ID not set in .env");
  }

  const [employeesFile, salesFile] = await Promise.all([
    downloadFileBuffer(employeesFileId),
    downloadFileBuffer(salesFileId),
  ]);

  const employeesWb = XLSX.read(employeesFile.buffer, { type: "buffer" });
  const salesWb = XLSX.read(salesFile.buffer, { type: "buffer" });

  const employees = sheetToJson(employeesWb, "Employees").map(normalizeRow);
  const stores = sheetToJson(salesWb, "Stores").map(normalizeRow);
  const brands = sheetToJson(salesWb, "Brands").map(normalizeRow);
  const sales = sheetToJson(salesWb, "Sales").map(normalizeRow);

  cache = {
    lastSynced: new Date().toISOString(),
    employees,
    stores,
    brands,
    sales,
  };
  saveCacheToDisk();
  return cache;
}

function getCache() {
  return cache;
}

function findEmployee(username, password) {
  return cache.employees.find(
    (e) =>
      String(e.username).trim().toLowerCase() === String(username).trim().toLowerCase() &&
      String(e.password) === String(password)
  );
}

// ---------- Aggregations used by the dashboard endpoints ----------

function getOrgOverview() {
  const { stores, brands } = cache;
  const activeStores = stores.filter((s) => String(s.status).toLowerCase() === "active");
  const companies = new Set(stores.map((s) => s.company).filter(Boolean));
  const countries = new Set(stores.map((s) => s.country).filter(Boolean));
  const brandNames = new Set(stores.map((s) => s.brand).filter(Boolean));

  return {
    totalBrands: brandNames.size || brands.length,
    totalCompanies: companies.size,
    totalCountries: countries.size,
    totalStores: activeStores.length,
    totalStoresAll: stores.length,
  };
}

function getStoresByCountry() {
  const counts = {};
  for (const s of cache.stores) {
    if (!s.country) continue;
    counts[s.country] = (counts[s.country] || 0) + 1;
  }
  return Object.entries(counts).map(([country, count]) => ({ country, count }));
}

function getStoreDirectory({ status } = {}) {
  let rows = cache.stores;
  if (status && status !== "All") {
    rows = rows.filter((s) => String(s.status).toLowerCase() === status.toLowerCase());
  }
  return rows;
}

function getContributionByRegion() {
  const totals = {};
  for (const row of cache.sales) {
    const store = cache.stores.find((s) => s.store_id === row.store_id);
    const region = store?.region || "Unknown";
    totals[region] = (totals[region] || 0) + Number(row.net_revenue || 0);
  }
  return Object.entries(totals)
    .map(([region, revenue]) => ({ region, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

function getContributionByBrand() {
  const totals = {};
  for (const row of cache.sales) {
    const brand = row.brand || "Unknown";
    totals[brand] = (totals[brand] || 0) + Number(row.net_revenue || 0);
  }
  return Object.entries(totals)
    .map(([brand, revenue]) => ({ brand, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

function getBrandList() {
  if (cache.brands.length) return cache.brands;
  // fall back to deriving brand list from stores if the Brands sheet is empty
  const names = new Set(cache.stores.map((s) => s.brand).filter(Boolean));
  return Array.from(names).map((brand) => ({ brand, logo_url: "", company: "" }));
}

function filterSalesByBrand(brand, { period } = {}) {
  let rows = cache.sales.filter((r) => r.brand === brand);
  if (period && period !== "YTD") {
    const now = new Date();
    const cutoff = new Date(now);
    if (period === "WTD") cutoff.setDate(now.getDate() - 7);
    if (period === "MTD") cutoff.setDate(now.getDate() - 30);
    rows = rows.filter((r) => new Date(r.date) >= cutoff);
  }
  return rows;
}

function getBrandDashboard(brand, { period = "YTD" } = {}) {
  const rows = filterSalesByBrand(brand, { period });

  const netRevenue = rows.reduce((sum, r) => sum + Number(r.net_revenue || 0), 0);
  const orders = rows.reduce((sum, r) => sum + Number(r.orders || 0), 0);
  const discounts = rows.reduce((sum, r) => sum + Number(r.discounts || 0), 0);
  const avgOrderValue = orders ? netRevenue / orders : 0;

  // Revenue trend by month
  const monthly = {};
  for (const r of rows) {
    const month = String(r.date).slice(0, 7); // YYYY-MM
    monthly[month] = (monthly[month] || 0) + Number(r.net_revenue || 0);
  }
  const revenueTrend = Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));

  // Revenue by region
  const byRegion = {};
  for (const r of rows) {
    const store = cache.stores.find((s) => s.store_id === r.store_id);
    const region = store?.country || "Unknown";
    byRegion[region] = (byRegion[region] || 0) + Number(r.net_revenue || 0);
  }
  const revenueByRegion = Object.entries(byRegion)
    .map(([region, revenue]) => ({ region, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  // Channel mix
  const byChannel = {};
  for (const r of rows) {
    const ch = r.channel || "Unknown";
    byChannel[ch] = (byChannel[ch] || 0) + Number(r.net_revenue || 0);
  }
  const channelMix = Object.entries(byChannel).map(([channel, revenue]) => ({ channel, revenue }));

  // Average daily sales per outlet, by month
  const outletCount = new Set(rows.map((r) => r.store_id)).size || 1;
  const daysByMonth = {};
  for (const r of rows) {
    const month = String(r.date).slice(0, 7);
    daysByMonth[month] = daysByMonth[month] || new Set();
    daysByMonth[month].add(r.date);
  }
  const avgDailySales = revenueTrend.map(({ month, revenue }) => {
    const days = daysByMonth[month]?.size || 1;
    return { month, value: revenue / days / outletCount };
  });

  // Locations by sales
  const byStore = {};
  for (const r of rows) {
    byStore[r.store_id] = byStore[r.store_id] || { revenue: 0, orders: 0, days: new Set() };
    byStore[r.store_id].revenue += Number(r.net_revenue || 0);
    byStore[r.store_id].orders += Number(r.orders || 0);
    byStore[r.store_id].days.add(r.date);
  }
  const locations = Object.entries(byStore).map(([storeId, agg]) => {
    const store = cache.stores.find((s) => s.store_id === storeId) || {};
    const days = agg.days.size || 1;
    return {
      storeId,
      name: store.store_name || storeId,
      country: store.country || "",
      ads: agg.revenue / days,
      avgCheck: agg.orders ? agg.revenue / agg.orders : 0,
      avgDailyTxns: agg.orders / days,
    };
  });
  locations.sort((a, b) => b.ads - a.ads);

  return {
    metrics: { netRevenue, orders, avgOrderValue, discounts },
    revenueTrend,
    revenueByRegion,
    channelMix,
    avgDailySales,
    locations,
    outletCount,
  };
}

loadCacheFromDisk();

module.exports = {
  refreshFromDrive,
  getCache,
  findEmployee,
  getOrgOverview,
  getStoresByCountry,
  getStoreDirectory,
  getContributionByRegion,
  getContributionByBrand,
  getBrandList,
  getBrandDashboard,
};
