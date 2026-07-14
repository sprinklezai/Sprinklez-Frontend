
import SalesAiChat from "../components/chat/SalesAiChat";
import StoreSalesTable from "../components/widgets/StoreSalesTable";
import RevenueComparisonPanel from "../components/widgets/RevenueComparisonPanel";
import ManagementSummary from "../components/widgets/ManagementSummary";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Loader2,
  Percent,
  Receipt,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import PieChartCard from "../components/charts/PieChartCard";
import LineChartCard from "../components/charts/LineChartCard";
import { getSalesDashboard } from "../api/sales";
import {
  getSalesMonths,
  type SalesMonthOption,
} from "../services/salesMonths";

type ItemMode = "revenue" | "quantity";

type SalesPeriod = "WTD" | "MTD" | "YTD";

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function monthValueFromDate(dateValue: string) {
  return String(dateValue || "").slice(0, 7).replace("-", "_");
}

function parseMonthValue(monthValue: string) {
  const match = /^(\d{4})_(\d{2})$/.exec(monthValue);

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    monthIndex: Number(match[2]) - 1,
  };
}

function getMonthStart(monthValue: string) {
  const parsed = parseMonthValue(monthValue);

  if (!parsed) {
    return "";
  }

  return formatIsoDate(
    new Date(parsed.year, parsed.monthIndex, 1)
  );
}

function getMonthEnd(monthValue: string) {
  const parsed = parseMonthValue(monthValue);

  if (!parsed) {
    return "";
  }

  return formatIsoDate(
    new Date(parsed.year, parsed.monthIndex + 1, 0)
  );
}

function getMonthCutoff(
  monthValue: string,
  latestAvailableDate: string
) {
  if (!monthValue) {
    return latestAvailableDate || "";
  }

  const monthEnd = getMonthEnd(monthValue);
  const latestMonth = monthValueFromDate(latestAvailableDate);

  if (
    latestAvailableDate &&
    monthValue === latestMonth
  ) {
    return latestAvailableDate;
  }

  return monthEnd;
}

function getMondayWeekStart(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  date.setDate(date.getDate() - daysFromMonday);

  return formatIsoDate(date);
}

function getAutomaticDateRange(
  period: SalesPeriod,
  monthValue: string,
  latestAvailableDate: string
) {
  const parsed = parseMonthValue(monthValue);
  const monthStart = getMonthStart(monthValue);
  const cutoff = getMonthCutoff(
    monthValue,
    latestAvailableDate
  );

  if (!parsed || !monthStart || !cutoff) {
    return {
      fromDate: "",
      toDate: latestAvailableDate || "",
    };
  }

  if (period === "YTD") {
    return {
      fromDate: `${parsed.year}-01-01`,
      toDate: cutoff,
    };
  }

  if (period === "WTD") {
    const calculatedWeekStart =
      getMondayWeekStart(cutoff);

    return {
      // Keep WTD inside the selected month.
      fromDate:
        calculatedWeekStart < monthStart
          ? monthStart
          : calculatedWeekStart,
      toDate: cutoff,
    };
  }

  return {
    fromDate: monthStart,
    toDate: cutoff,
  };
}


function SalesDashboard() {
  const { brandCode } = useParams();
  const code = String(brandCode || "").toUpperCase();

  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [monthOptions, setMonthOptions] = useState<SalesMonthOption[]>([]);
  const [month, setMonth] = useState("");
  const [monthsLoading, setMonthsLoading] = useState(true);
  const [monthsError, setMonthsError] = useState("");

  const [period, setPeriod] = useState<SalesPeriod>("MTD");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [latestAvailableDate, setLatestAvailableDate] = useState("");
  const [topMode, setTopMode] = useState<ItemMode>("revenue");
  const [bottomMode, setBottomMode] = useState<ItemMode>("revenue");

  const compactMoney = (value: number) => {
    const amount = Number(value || 0);
    if (Math.abs(amount) >= 1000000) return `AED ${(amount / 1000000).toFixed(2)}M`;
    if (Math.abs(amount) >= 1000) return `AED ${(amount / 1000).toFixed(0)}K`;
    return `AED ${Math.round(amount).toLocaleString()}`;
  };

  const money = (value: number) =>
    `AED ${Math.round(Number(value || 0)).toLocaleString()}`;
  const number = (value: number) =>
    Math.round(Number(value || 0)).toLocaleString();

  const cleanStoreName = (name: string) =>
    String(name || "")
      .replace(/^SLI\s+/i, "")
      .replace(/^WSP\s+/i, "")
      .replace(/^ALB\s+/i, "")
      .replace(/^NAN\s+/i, "")
      .replace(/^CSC\s+/i, "")
      .trim();

  useEffect(() => {
    let mounted = true;

    async function loadMonths() {
      try {
        setMonthsLoading(true);
        setMonthsError("");
        const result = await getSalesMonths();
        if (!mounted) return;

        const months = result.months || [];
        const latestMonth =
          result.latestMonth || months[0]?.value || "";
        const latestDate =
          result.latestAvailableDate || "";

        setMonthOptions(months);
        setMonth(latestMonth);
        setLatestAvailableDate(latestDate);
        setPeriod("MTD");

        const automaticRange = getAutomaticDateRange(
          "MTD",
          latestMonth,
          latestDate
        );

        setFromDate(automaticRange.fromDate);
        setToDate(automaticRange.toDate);
      } catch (error) {
        console.error(error);
        if (mounted) setMonthsError("Unable to load available sales months.");
      } finally {
        if (mounted) setMonthsLoading(false);
      }
    }

    loadMonths();
    return () => {
      mounted = false;
    };
  }, []);

  const loadSales = async () => {
    if (!code || !month) return;

    try {
      setLoading(true);
      const data = await getSalesDashboard(code, month, {
        period,
        country: selectedCountry,
        store: selectedStore,
        search,
        fromDate,
        toDate,
      });
      setSalesData(data);
    } catch (error) {
      console.error("Sales dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code && month) loadSales();
  }, [code, month, period, selectedCountry, selectedStore, fromDate, toDate]);

  const applyAutomaticRange = (
    nextPeriod: SalesPeriod,
    nextMonth: string
  ) => {
    const automaticRange = getAutomaticDateRange(
      nextPeriod,
      nextMonth,
      latestAvailableDate
    );

    setFromDate(automaticRange.fromDate);
    setToDate(automaticRange.toDate);
  };

  const handlePeriodChange = (
    nextPeriod: SalesPeriod
  ) => {
    setPeriod(nextPeriod);
    applyAutomaticRange(nextPeriod, month);
  };

  const handleMonthChange = (
    nextMonth: string
  ) => {
    setMonth(nextMonth);
    applyAutomaticRange(period, nextMonth);
  };

  const resetFilters = () => {
    const latestMonth =
      monthOptions[0]?.value || month;

    setSelectedCountry("");
    setSelectedStore("");
    setSearch("");
    setMonth(latestMonth);
    setPeriod("MTD");

    const automaticRange = getAutomaticDateRange(
      "MTD",
      latestMonth,
      latestAvailableDate
    );

    setFromDate(automaticRange.fromDate);
    setToDate(automaticRange.toDate);
  };

  const kpis = salesData?.kpis || {};

  const selectedMonthCutoff = getMonthCutoff(
    month,
    latestAvailableDate
  );

  const isDashboardRefreshing = loading || monthsLoading;
  const brandName =
    salesData?.brandName ||
    {
      SLI: "Sushi Library",
      WSP: "Wingstop",
      ALB: "Allo Beirut",
      NAN: "Nando's",
      CSC: "Cold Stone Creamery",
      JMP: "Jamie's Pizzeria",
      JMT: "Jamie's Italian",
      MCC: "Molten Chocolate Café",
    }[code] ||
    code;

  const mapTrend = (items: any[] = []) =>
    items.map((item) => ({
      name: String(item.date || "").slice(5),
      value: Math.round(Number(item.value || 0)),
    }));

  const revenueTrend = mapTrend(salesData?.revenueTrend);
  const ordersTrend = mapTrend(salesData?.ordersTrend);
  const aovTrend = mapTrend(salesData?.avgOrderValueTrend);
  const countrySales =
    salesData?.countrySales?.map((item: any) => ({
      name: item.name,
      value: Math.round(Number(item.value || 0)),
    })) || [];

  const channelMix =
    salesData?.salesTypeMix?.map((item: any) => ({
      name: item.name || "Unknown",
      value: Math.round(Number(item.value || 0)),
    })) || [];

  const topItems = useMemo(
    () =>
      topMode === "quantity"
        ? salesData?.topItemsByQuantity || []
        : salesData?.topItemsByRevenue || [],
    [salesData, topMode]
  );

  const bottomItems = useMemo(
    () =>
      bottomMode === "quantity"
        ? salesData?.bottomItemsByQuantity || []
        : salesData?.bottomItemsByRevenue || [],
    [salesData, bottomMode]
  );

  return (
    <BrandLayout brandCode={code} brandName={brandName}>
      <div className="relative min-h-screen bg-[#F4F8F6]">
        <div
          className={`transition-all duration-300 ${
            isDashboardRefreshing
              ? "pointer-events-none select-none blur-sm"
              : "blur-0"
          }`}
        >
        <section className="sticky top-0 z-20 border-b border-emerald-100 bg-[#F4F8F6]/95 px-1 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C89B3C]">
                Executive Analytics
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-stone-950">
                Sales Dashboard
              </h1>
              <p className="text-xs text-stone-500">
                {brandName} · {period} · Data through{" "}
                {salesData?.periodInfo?.endDate || toDate}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DateField
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
                max={selectedMonthCutoff}
              />

              <DateField
                label="To Date"
                value={toDate}
                onChange={setToDate}
                max={selectedMonthCutoff}
              />

              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="h-11 rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold"
              >
                <option value="">All Locations</option>
                {(salesData?.filters?.stores || []).map((store: any) => (
                  <option key={store.store_code} value={store.store_code}>
                    {cleanStoreName(store.store_name)}
                  </option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedStore("");
                }}
                className="h-11 rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold"
              >
                <option value="">All Countries</option>
                {(salesData?.filters?.countries || []).map((country: string) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <div className="flex h-11 rounded-xl border border-stone-300 bg-white p-1">
                {(["WTD", "MTD", "YTD"] as SalesPeriod[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePeriodChange(item)}
                    className={`rounded-lg px-4 text-xs font-bold ${
                      period === item
                        ? "bg-[#0F6B52] text-white"
                        : "text-stone-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <select
                value={month}
                onChange={(e) => handleMonthChange(e.target.value)}
                disabled={monthsLoading}
                className="h-11 rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold"
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {latestAvailableDate && (
                <div className="flex h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-[#0F6B52]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Latest data: {latestAvailableDate}
                </div>
              )}

              <div className="relative">
                <Search size={14} className="absolute left-3 top-3.5 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadSales()}
                  placeholder="Search products..."
                  className="h-11 w-44 rounded-xl border border-stone-300 bg-white pl-9 pr-3 text-xs"
                />
              </div>

              <button onClick={loadSales} className="flex h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-xs font-bold">
                <RefreshCw size={14} /> Refresh
              </button>

              <button onClick={resetFilters} className="h-11 rounded-xl border border-stone-300 bg-white px-4 text-xs font-bold">
                Reset
              </button>

              <button className="flex h-11 items-center gap-2 rounded-xl bg-[#0F6B52] px-4 text-xs font-bold text-white">
                <Download size={14} /> Export
              </button>
            </div>
          </div>
        </section>

        {monthsError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {monthsError}
          </div>
        )}

        <>
            <section className="mt-6">
              <ManagementSummary data={salesData?.managementSummary || null} />
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <Kpi title="Net Revenue" value={compactMoney(kpis.netRevenue)} icon={<TrendingUp size={18} />} />
              <Kpi title="Total Orders" value={number(kpis.orders)} icon={<Receipt size={18} />} />
              <Kpi title="Average Order Value" value={money(kpis.avgOrderValue)} icon={<CreditCard size={18} />} />
              <Kpi title="ADS / Outlet" value={money(kpis.averageDailySalesPerOutlet)} icon={<CalendarDays size={18} />} />
              <Kpi title="Active Stores" value={number(kpis.activeStores)} icon={<CheckCircle2 size={18} />} />
              <Kpi title="Discount %" value={`${Number(kpis.discountPercent || 0).toFixed(2)}%`} icon={<Percent size={18} />} accent="gold" />
            </section>

            <section className="mt-6">
              <RevenueComparisonPanel
                monthlyData={
                  salesData?.revenueComparison
                    ?.monthlyRevenueComparison || []
                }
                regionData={
                  salesData?.revenueComparison
                    ?.regionRevenue || []
                }
                currency={salesData?.currency || "AED"}
              />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-3">
              <LineChartCard title="Revenue Trend" subtitle="Net revenue over time" data={revenueTrend} />
              <LineChartCard title="Orders Trend" subtitle="Transactions over time" data={ordersTrend} />
              <LineChartCard title="Average Order Value Trend" subtitle="Spend per transaction" data={aovTrend} />
            </section>

            {/* Hourly Sales Trend is temporarily disabled.
                Enable it after the LS Retail analytics view provides hourly data. */}

            <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_1.2fr]">
              <PieChartCard title="Revenue by Channel" subtitle="Contribution by channel" data={channelMix} />
              <PieChartCard title="Revenue by Country" subtitle="Contribution by country" data={countrySales} />
              <ExecutiveAlerts alerts={salesData?.executiveAlerts || []} />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <ItemTable title="Top Selling Items" data={topItems} mode={topMode} onModeChange={setTopMode} formatMoney={compactMoney} formatNumber={number} />
              <ItemTable title="Bottom Selling Items" data={bottomItems} mode={bottomMode} onModeChange={setBottomMode} formatMoney={compactMoney} formatNumber={number} />
            </section>

            <section className="mt-6">
              <StoreSalesTable
              data={salesData?.storeDirectory || []}
              reportingDays={Number(
              salesData?.kpis?.reportingDays || 1
                )}
                pageSize={15}
                />
            </section>
          </>
        </div>

        {isDashboardRefreshing && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]"
            role="status"
            aria-live="polite"
            aria-label="Refreshing Executive Dashboard"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/95 p-7 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#0F6B52]">
                <Loader2 size={30} className="animate-spin" />
              </div>

              <h2 className="mt-5 text-lg font-extrabold text-stone-950">
                Refreshing Executive Dashboard
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Loading the latest sales data, KPIs, trends and store performance.
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-[#0F6B52]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <SalesAiChat
      filters={{
        brandCode: code,
        month,
        period,
        country: selectedCountry,
        store: selectedStore,
        fromDate,
        toDate,
      }}
    />






    </BrandLayout>
  );
}

function DateField({
  label,
  value,
  onChange,
  min,
  max,
}: any) {
  return (
    <label className="rounded-xl border border-stone-300 bg-white px-3 py-1.5">
      <span className="block text-[10px] font-semibold text-stone-400">
        {label}
      </span>

      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-xs font-semibold outline-none"
      />
    </label>
  );
}

function Kpi({ title, value, icon, accent = "green" }: any) {
  const color = accent === "gold" ? "text-[#C89B3C] bg-[#FBF4E4]" : "text-[#0F6B52] bg-[#E7F3EF]";
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
        <div>
          <p className="text-[11px] font-semibold text-stone-500">{title}</p>
          <h2 className="mt-1 text-xl font-black text-stone-950">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function ExecutiveAlerts({ alerts }: { alerts: any[] }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} className="text-[#C89B3C]" />
        <h3 className="text-base font-bold">Executive Alerts</h3>
      </div>
      <div className="mt-4 space-y-3">
        {alerts.slice(0, 6).map((alert: any, index: number) => (
          <div
            key={index}
            className={`rounded-xl border px-3 py-2 text-xs ${
              alert.level === "critical"
                ? "border-red-200 bg-red-50 text-red-700"
                : alert.level === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
}



function ItemTable({ title, data, mode, onModeChange, formatMoney, formatNumber }: any) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        <div className="flex rounded-xl border border-emerald-200 bg-emerald-50 p-1">
          {(["revenue", "quantity"] as ItemMode[]).map((item) => (
            <button key={item} onClick={() => onModeChange(item)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mode === item ? "bg-[#0F6B52] text-white" : "text-[#0F6B52]"}`}>
              By {item === "revenue" ? "Revenue" : "Quantity"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead><tr className="border-b text-xs uppercase text-stone-400"><th className="py-3 text-left">#</th><th className="text-left">Item</th><th className="text-right">Qty</th><th className="text-right">Net Sales</th><th className="text-right">Avg Price</th></tr></thead>
          <tbody>
            {data.slice(0, 10).map((item: any, index: number) => (
              <tr key={`${item.item_no}-${index}`} className="border-b border-stone-100">
                <td className="py-4 text-left font-bold text-[#C89B3C]">{String(index + 1).padStart(2, "0")}</td>
                <td className="text-left font-semibold">{item.item_description || item.item_no}</td>
                <td className="text-right">{formatNumber(item.quantity)}</td>
                <td className="text-right font-bold">{formatMoney(item.net_sales)}</td>
                <td className="text-right">{formatMoney(Number(item.quantity || 0) ? Number(item.net_sales || 0) / Number(item.quantity) : 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesDashboard;
