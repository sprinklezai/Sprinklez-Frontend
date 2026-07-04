import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Layout from "../components/Layout.jsx";
import FilterBar from "../components/FilterBar.jsx";
import MetricCard from "../components/MetricCard.jsx";
import api from "../api/client";

function fmtCurrency(n) {
  if (n === undefined || n === null) return "–";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export default function BrandDashboard() {
  const { brand } = useParams();
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("YTD");
  const [locTab, setLocTab] = useState("Top10");
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data } = await api.get(`/api/data/brands/${encodeURIComponent(brand)}`, {
      params: { period },
    });
    setData(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, period]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await api.post("/api/data/refresh");
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  function handleExport() {
    if (!data) return;
    const rows = data.locations.map((l) => `${l.name},${l.country},${l.ads},${l.avgCheck},${l.avgDailyTxns}`);
    const csv = ["name,country,ads,avg_check,avg_daily_txns", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brand}-locations.csv`;
    a.click();
  }

  const locations = data?.locations
    ? locTab === "Top10"
      ? data.locations.slice(0, 10)
      : data.locations.slice(-10).reverse()
    : [];

  const channelTotal = data?.channelMix?.reduce((s, c) => s + c.revenue, 0) || 1;
  const dineIn = data?.channelMix?.find((c) => c.channel === "Dine-In");
  const dineInPct = dineIn ? Math.round((dineIn.revenue / channelTotal) * 100) : 0;

  return (
    <Layout>
      <FilterBar
        title={`${brand} · Sales Dashboard`}
        subtitle={`All Locations · Jan–Jun 2026 · ${period === "YTD" ? "Year to date" : period}`}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onExport={handleExport}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <MetricCard label="Net Revenue" value={`₹${fmtCurrency(data?.metrics.netRevenue)}`} delta={0} />
        <MetricCard label="Orders" value={data?.metrics.orders?.toLocaleString() ?? "–"} delta={0} />
        <MetricCard label="Avg Order Value" value={`₹${data?.metrics.avgOrderValue?.toFixed(1) ?? "–"}`} delta={0} />
        <MetricCard label="Discounts" value={`₹${fmtCurrency(data?.metrics.discounts)}`} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="col-span-2 bg-card border border-line rounded-card shadow-card p-4">
          <div className="text-[13px] font-semibold text-ink mb-1">Revenue Trend</div>
          <div className="text-[11.5px] text-muted mb-3">Net revenue · monthly</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data?.revenueTrend || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8a948c" }} />
              <YAxis tick={{ fontSize: 11, fill: "#8a948c" }} />
              <Tooltip formatter={(v) => `₹${fmtCurrency(v)}`} />
              <Bar dataKey="revenue" fill="#1f5c47" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-line rounded-card shadow-card p-4">
          <div className="text-[13px] font-semibold text-ink mb-1">Revenue by Region</div>
          <div className="text-[11.5px] text-muted mb-3">Click a region to drill in</div>
          <div className="flex flex-col gap-2.5 mt-2">
            {data?.revenueByRegion?.map((r) => {
              const max = data.revenueByRegion[0]?.revenue || 1;
              const pct = (r.revenue / max) * 100;
              return (
                <div key={r.region}>
                  <div className="flex justify-between text-[12px] text-ink mb-1">
                    <span>{r.region}</span>
                    <span className="font-medium">₹{fmtCurrency(r.revenue)}</span>
                  </div>
                  <div className="h-2 bg-brand-light rounded-full overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="col-span-2 bg-card border border-line rounded-card shadow-card p-4">
          <div className="text-[13px] font-semibold text-ink mb-1">Average Daily Sales / Outlet</div>
          <div className="text-[11.5px] text-muted mb-3">{data?.outletCount ?? 0} outlets · monthly</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data?.avgDailySales || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8a948c" }} />
              <YAxis tick={{ fontSize: 11, fill: "#8a948c" }} />
              <Tooltip formatter={(v) => `₹${fmtCurrency(v)}`} />
              <Line type="monotone" dataKey="value" stroke="#1f5c47" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-line rounded-card shadow-card p-4">
          <div className="text-[13px] font-semibold text-ink mb-1">Channel Mix</div>
          <div className="text-[11.5px] text-muted mb-4">Dine-In vs Delivery &amp; Takeaway</div>
          <div className="text-[26px] font-bold text-ink">{dineInPct}%</div>
          <div className="text-[12px] text-muted mb-3">dine-in</div>
          <div className="h-2.5 rounded-full overflow-hidden flex mb-3">
            <div className="bg-brand" style={{ width: `${dineInPct}%` }} />
            <div className="bg-accent" style={{ width: `${100 - dineInPct}%` }} />
          </div>
          {data?.channelMix?.map((c) => (
            <div key={c.channel} className="flex items-center justify-between text-[12px] mb-1">
              <span className="flex items-center gap-1.5 text-ink">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: c.channel === "Dine-In" ? "#1f5c47" : "#c17f3e" }}
                />
                {c.channel}
              </span>
              <span className="font-medium text-ink">₹{fmtCurrency(c.revenue)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-line rounded-card shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[13px] font-semibold text-ink">Locations by Sales</div>
            <div className="text-[11.5px] text-muted">ADS in thousands per day</div>
          </div>
          <div className="flex items-center bg-brand-light/60 rounded-md p-0.5 border border-line">
            {["Top10", "Bottom10"].map((t) => (
              <button
                key={t}
                onClick={() => setLocTab(t)}
                className={`px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
                  locTab === t ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {t === "Top10" ? "Top 10" : "Bottom 10"}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-muted border-b border-line">
              <th className="py-2 font-medium w-8">#</th>
              <th className="py-2 font-medium">Location</th>
              <th className="py-2 font-medium">Country</th>
              <th className="py-2 font-medium text-right">ADS</th>
              <th className="py-2 font-medium text-right">Avg Check</th>
              <th className="py-2 font-medium text-right">Avg Daily Txns</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l, i) => (
              <tr key={l.storeId} className="border-b border-line/60 last:border-0">
                <td className="py-2 text-accent font-semibold">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-2 text-ink font-medium">{l.name}</td>
                <td className="py-2 text-ink">{l.country}</td>
                <td className="py-2 text-ink text-right">₹{fmtCurrency(l.ads)}</td>
                <td className="py-2 text-ink text-right">₹{l.avgCheck.toFixed(0)}</td>
                <td className="py-2 text-ink text-right">{l.avgDailyTxns.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
