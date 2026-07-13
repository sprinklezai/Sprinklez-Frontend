import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  RefreshCw,
  Receipt,
  Store,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import BrandCard from "../components/widgets/BrandCard";
import { getExecutiveOverview } from "../api/executiveOverview";
import ExecutiveOverviewLoading from "../components/widgets/ExecutiveOverviewLoading";

const brandLogoMap: Record<string, string> = {
  ALB: "/brand-logos/allo-beirut.png",
  WSP: "/brand-logos/wingstop.png",
  CSC: "/brand-logos/coldstone.png",
  SLI: "/brand-logos/sushi-library.png",
  NAN: "/brand-logos/nandos.png",
  JMP: "/brand-logos/jamies-pizzeria.png",
  JMT: "/brand-logos/jamies-italian.png",
  MCC: "/brand-logos/molten.png",
};

type Period = "MTD" | "YTD";

function Overview() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [period, setPeriod] = useState<Period>("MTD");
  const [country, setCountry] = useState("");

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await getExecutiveOverview({
        period,
        country,
      });
      setOverview(data);
    } catch (error) {
      console.error("Executive overview loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [period, country]);

  const kpis = overview?.kpis || {};
  const brandCards = overview?.brandPortfolio || [];
  const brandRevenue = overview?.revenueByBrand || [];
  const countryRevenue = overview?.revenueByCountry || [];
  const topStores = overview?.topStores || [];
  const bottomStores = overview?.bottomStores || [];
  const alerts = overview?.executiveAlerts || [];
  const summary = overview?.executiveSummary || [];
  const system = overview?.systemHealth || {};

  const countries = useMemo(
    () => overview?.filters?.countries || [],
    [overview]
  );

  return (
    <DashboardLayout>
      <div className="relative min-h-screen rounded-3xl bg-[#F4F8F6] p-1">
        <div
          className={`transition-all duration-300 ${
            loading && overview
              ? "pointer-events-none select-none blur-sm"
              : ""
          }`}
        >
          <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C89B3C]">
                  Sprinklez F&amp;B Division
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
                  Executive Overview
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Live business performance and management insights
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-11 rounded-xl border border-slate-200 bg-white p-1">
                  {(["MTD", "YTD"] as Period[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPeriod(item)}
                      className={`rounded-lg px-4 text-xs font-bold ${
                        period === item
                          ? "bg-[#0F6B52] text-white"
                          : "text-slate-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold"
                >
                  <option value="">All Countries</option>
                  {countries.map((item: string) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <div className="flex h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-semibold text-[#0F6B52]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Latest data: {system.latestAvailableDate || "—"}
                </div>

                <button
                  type="button"
                  onClick={loadOverview}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#0F6B52] px-4 text-xs font-bold text-white"
                >
                  <RefreshCw size={15} />
                  Refresh Data
                </button>
              </div>
            </div>
          </section>

          {!overview && loading ? (
            <div className="mt-6">
              <ExecutiveOverviewLoading />
            </div>
          ) : (
            <>
              <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <MetricCard
                  title="Net Revenue"
                  value={formatMoney(kpis.netRevenue)}
                  trend={kpis.revenueGrowthPercent}
                  subtitle="vs prior comparable period"
                  icon={<TrendingUp size={19} />}
                />
                <MetricCard
                  title="Orders"
                  value={formatNumber(kpis.orders)}
                  trend={kpis.ordersGrowthPercent}
                  subtitle="Customer transactions"
                  icon={<Receipt size={19} />}
                  accent="blue"
                />
                <MetricCard
                  title="Average Check"
                  value={formatMoney(kpis.avgOrderValue)}
                  trend={kpis.aovGrowthPercent}
                  subtitle="Revenue per transaction"
                  icon={<CreditCard size={19} />}
                  accent="purple"
                />
                <MetricCard
                  title="Active Stores"
                  value={formatNumber(kpis.activeStores)}
                  subtitle={`${formatNumber(kpis.totalStores)} total stores`}
                  icon={<Store size={19} />}
                />
                <MetricCard
                  title="Gross Profit"
                  value={
                    kpis.grossProfitAvailable
                      ? formatMoney(kpis.grossProfit)
                      : "P&L Pending"
                  }
                  subtitle={
                    kpis.grossProfitAvailable
                      ? `${Number(kpis.grossMarginPercent || 0).toFixed(1)}% margin`
                      : "Finance data required"
                  }
                  icon={<CircleDollarSign size={19} />}
                  accent="gold"
                />
                <MetricCard
                  title="Growth vs Prior"
                  value={`${Number(kpis.revenueGrowthPercent || 0).toFixed(1)}%`}
                  subtitle="Revenue growth"
                  icon={<BarChart3 size={19} />}
                  accent="teal"
                />
              </section>

              <section className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_1.35fr_1.35fr]">
                <ExecutiveSummary items={summary} />
                <HorizontalBarCard
                  title="Revenue by Brand"
                  subtitle={`${period} net revenue`}
                  data={brandRevenue}
                />
                <HorizontalBarCard
                  title="Revenue by Country"
                  subtitle={`${period} country contribution`}
                  data={countryRevenue}
                />
              </section>

              <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-950">
                    Our Brand Portfolio
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select a brand to open its detailed sales dashboard
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {brandCards.map((brand: any) => (
                    <BrandCard
                      key={brand.brand_code}
                      name={brand.brand_name}
                      code={brand.brand_code}
                      logo={brandLogoMap[brand.brand_code] || ""}
                      stores={brand.stores}
                      countries={brand.countries}
                    />
                  ))}
                </div>
              </section>

              <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_1fr_0.85fr]">
                <ExecutiveAlerts alerts={alerts} />
                <StoreRankingCard
                  title="Top 5 Performing Stores"
                  rows={topStores}
                  positive
                />
                <StoreRankingCard
                  title="Bottom 5 Performing Stores"
                  rows={bottomStores}
                />
                <SystemHealth data={system} />
              </section>
            </>
          )}
        </div>

        {loading && overview && (
          <div className="absolute inset-0 z-40 flex items-center justify-center rounded-3xl bg-slate-950/20 backdrop-blur-[2px]">
            <div className="w-[340px] rounded-3xl border border-white/70 bg-white p-7 text-center shadow-2xl">
              <RefreshCw
                size={38}
                className="mx-auto animate-spin text-[#0F6B52]"
              />
              <h2 className="mt-4 text-lg font-extrabold text-slate-950">
                Refreshing Executive Overview
              </h2>
              <p className="mt-2 text-sm leading-5 text-slate-500">
                Loading the latest KPIs, brand performance, country contribution
                and store insights.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  accent = "green",
}: any) {
  const styles: Record<string, string> = {
    green: "bg-emerald-50 text-[#0F6B52]",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-violet-50 text-violet-600",
    gold: "bg-amber-50 text-amber-600",
    teal: "bg-teal-50 text-teal-600",
  };

  const numericTrend = Number(trend || 0);
  const positive = numericTrend >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl p-3 ${styles[accent]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500">{title}</p>
          <p className="mt-1 truncate text-xl font-black text-slate-950">
            {value}
          </p>
          {trend !== undefined && trend !== null ? (
            <p
              className={`mt-1 flex items-center gap-1 text-[10px] font-bold ${
                positive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(numericTrend).toFixed(1)}% {subtitle}
            </p>
          ) : (
            <p className="mt-1 text-[10px] text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutiveSummary({ items }: { items: any[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-violet-600" />
        <h3 className="text-base font-extrabold text-slate-950">
          Executive Summary
        </h3>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
          AI-style Insights
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {(items || []).slice(0, 6).map((item: any, index: number) => (
          <div
            key={index}
            className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-3"
          >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
            <p className="text-xs leading-5 text-slate-700">
              {item.message || item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarCard({ title, subtitle, data }: any) {
  const maximum = Math.max(
    ...(data || []).map((item: any) => Number(item.value || 0)),
    1
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-6 space-y-4">
        {(data || []).slice(0, 8).map((item: any) => {
          const percentage =
            Number(item.percentage ?? (Number(item.value || 0) / maximum) * 100);

          return (
            <div key={item.name}>
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-semibold text-slate-700">
                  {item.name}
                </span>
                <span className="whitespace-nowrap text-xs font-bold text-slate-950">
                  {formatMoney(item.value)} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0F6B52] to-[#55B78E]"
                  style={{
                    width: `${Math.max(
                      2,
                      (Number(item.value || 0) / maximum) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExecutiveAlerts({ alerts }: { alerts: any[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-950">
        Executive Alerts
      </h3>
      <div className="mt-4 space-y-3">
        {(alerts || []).slice(0, 5).map((alert: any, index: number) => (
          <div
            key={index}
            className={`rounded-2xl border p-3 ${
              alert.level === "critical"
                ? "border-red-200 bg-red-50"
                : alert.level === "warning"
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex gap-2">
              <AlertTriangle
                size={15}
                className={
                  alert.level === "critical"
                    ? "text-red-600"
                    : alert.level === "warning"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }
              />
              <p className="text-[11px] leading-4 text-slate-700">
                {alert.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreRankingCard({
  title,
  rows,
  positive = false,
}: {
  title: string;
  rows: any[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>
      <div className="mt-4 divide-y divide-slate-100">
        {(rows || []).slice(0, 5).map((row: any, index: number) => (
          <div
            key={`${row.store_code}-${index}`}
            className="grid grid-cols-[24px_1fr_auto] items-center gap-2 py-3"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                positive ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-slate-800">
                {row.store_name}
              </p>
              <p className="text-[10px] text-slate-400">{row.country_name}</p>
            </div>
            <p className="text-[11px] font-bold text-slate-900">
              {formatMoney(row.net_sales)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemHealth({ data }: { data: any }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-950">
        Data &amp; System Status
      </h3>
      <div className="mt-5 space-y-4 text-[11px]">
        <StatusLine
          label="Last Data Refresh"
          value={data.lastRefresh || "—"}
        />
        <StatusLine
          label="Data Load Status"
          value={data.loadStatus || "Available"}
        />
        <StatusLine
          label="Data Coverage"
          value={`${Number(data.coveragePercent || 0).toFixed(0)}%`}
        />
        <StatusLine
          label="Stores Synced"
          value={`${formatNumber(data.syncedStores)} / ${formatNumber(
            data.totalStores
          )}`}
        />
        <StatusLine
          label="Pending Stores"
          value={formatNumber(data.pendingStores)}
        />
      </div>
    </div>
  );
}

function StatusLine({ label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
      <div>
        <p className="font-semibold text-slate-600">{label}</p>
        <p className="mt-0.5 font-bold text-[#0F6B52]">{value}</p>
      </div>
    </div>
  );
}

function formatMoney(value: number) {
  const amount = Number(value || 0);
  if (Math.abs(amount) >= 1_000_000) {
    return `AED ${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `AED ${(amount / 1_000).toFixed(0)}K`;
  }
  return `AED ${Math.round(amount).toLocaleString()}`;
}

function formatNumber(value: number) {
  return Math.round(Number(value || 0)).toLocaleString();
}

export default Overview;
