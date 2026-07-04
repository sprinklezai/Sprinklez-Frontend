import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Layout from "../components/Layout.jsx";
import FilterBar from "../components/FilterBar.jsx";
import MetricCard from "../components/MetricCard.jsx";
import api from "../api/client";

const STATUS_TABS = ["All", "Active", "Inactive"];

function BrandButton({ brand, onClick }) {
  const initial = brand.brand?.[0]?.toUpperCase() || "?";
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-card border border-line rounded-card shadow-card px-4 py-3 hover:border-brand hover:shadow-md transition-all min-w-[180px]"
    >
      {brand.logo_url ? (
        <img src={brand.logo_url} alt={brand.brand} className="w-9 h-9 rounded-md object-cover" />
      ) : (
        <div className="w-9 h-9 rounded-md bg-brand-light flex items-center justify-center text-brand-dark font-bold">
          {initial}
        </div>
      )}
      <div className="text-left">
        <div className="text-[13.5px] font-semibold text-ink">{brand.brand}</div>
        <div className="text-[11.5px] text-muted">{brand.company || "View sales dashboard"}</div>
      </div>
    </button>
  );
}

export default function CompanyOverview() {
  const [data, setData] = useState(null);
  const [stores, setStores] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [period, setPeriod] = useState("YTD");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  async function loadOverview() {
    const { data } = await api.get("/api/data/overview");
    setData(data);
  }

  async function loadStores(status) {
    const { data } = await api.get("/api/data/stores", { params: { status } });
    setStores(data);
  }

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    loadStores(statusFilter);
  }, [statusFilter]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await api.post("/api/data/refresh");
      await loadOverview();
      await loadStores(statusFilter);
    } finally {
      setRefreshing(false);
    }
  }

  function handleExport() {
    const rows = stores.map((s) => Object.values(s).join(","));
    const csv = [Object.keys(stores[0] || {}).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "store-directory.csv";
    a.click();
  }

  const lastSynced = data?.lastSynced ? new Date(data.lastSynced).toLocaleString() : "never — click Refresh Data";

  return (
    <Layout>
      <FilterBar
        title="Business Overview"
        subtitle={`All Locations · All Countries · Year to date · updated ${lastSynced}`}
        period={period}
        onPeriodChange={setPeriod}
        search={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onExport={handleExport}
      />

      {/* Brand entry points */}
      <div className="mb-6">
        <div className="text-[13px] font-semibold text-ink mb-3">Brands</div>
        <div className="flex flex-wrap gap-3">
          {data?.brands
            ?.filter((b) => b.brand?.toLowerCase().includes(search.toLowerCase()))
            .map((b) => (
              <BrandButton
                key={b.brand}
                brand={b}
                onClick={() => navigate(`/brands/${encodeURIComponent(b.brand)}`)}
              />
            ))}
        </div>
      </div>

      {/* Org metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Brands" value={data?.org.totalBrands ?? "–"} />
        <MetricCard label="Companies" value={data?.org.totalCompanies ?? "–"} />
        <MetricCard label="Countries" value={data?.org.totalCountries ?? "–"} />
        <MetricCard label="Active Stores" value={data?.org.totalStores ?? "–"} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-line rounded-card shadow-card p-4">
          <div className="text-[13px] font-semibold text-ink mb-1">Stores by Country</div>
          <div className="text-[11.5px] text-muted mb-3">Distribution of all registered stores</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.storesByCountry || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="country" tick={{ fontSize: 11, fill: "#8a948c" }} />
              <YAxis tick={{ fontSize: 11, fill: "#8a948c" }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1f5c47" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-line rounded-card shadow-card p-4">
          <div className="text-[13px] font-semibold text-ink mb-1">Contribution by Region</div>
          <div className="text-[11.5px] text-muted mb-3">Net revenue share, all brands</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.contributionByRegion || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#8a948c" }} />
              <YAxis type="category" dataKey="region" width={80} tick={{ fontSize: 11, fill: "#8a948c" }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#c17f3e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-line rounded-card shadow-card p-4 mb-6">
        <div className="text-[13px] font-semibold text-ink mb-1">Contribution by Brand</div>
        <div className="text-[11.5px] text-muted mb-3">Net revenue share across brands</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data?.contributionByBrand || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="brand" tick={{ fontSize: 11, fill: "#8a948c" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8a948c" }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#1f5c47" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Store directory */}
      <div className="bg-card border border-line rounded-card shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[13px] font-semibold text-ink">Store Directory</div>
            <div className="text-[11.5px] text-muted">{stores.length} stores</div>
          </div>
          <div className="flex items-center bg-brand-light/60 rounded-md p-0.5 border border-line">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
                  statusFilter === s ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-muted border-b border-line">
              <th className="py-2 font-medium">Store</th>
              <th className="py-2 font-medium">Brand</th>
              <th className="py-2 font-medium">Country</th>
              <th className="py-2 font-medium">Region</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.store_id} className="border-b border-line/60 last:border-0">
                <td className="py-2 text-ink font-medium">{s.store_name}</td>
                <td className="py-2 text-ink">{s.brand}</td>
                <td className="py-2 text-ink">{s.country}</td>
                <td className="py-2 text-ink">{s.region}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      String(s.status).toLowerCase() === "active"
                        ? "bg-brand-light text-brand-dark"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
