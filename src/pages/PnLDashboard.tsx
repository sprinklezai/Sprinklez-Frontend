import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Banknote,
  Building2,
  CircleDollarSign,
  Download,
  RefreshCw,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import LineChartCard from "../components/charts/LineChartCard";
import BarChartCard from "../components/charts/BarChartCard";
import { getPnlDashboard } from "../api/pnl";

type PnlData = {
  success: boolean;
  brandCode: string;
  brandName: string;
  fromDate: string | null;
  toDate: string | null;
  currency: string;
  kpis: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    grossMarginPercent: number;
    laborCost: number;
    occupancyCost: number;
    deliveryFees: number;
    otherOpex: number;
    ebitda: number;
    ebitdaMarginPercent: number;
  };
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    grossProfit: number;
    ebitda: number;
  }>;
  costMix: Array<{
    name: string;
    value: number;
  }>;
  storePnl: Array<{
    store_code: string;
    store_name: string;
    revenue: number;
    gross_profit: number;
    ebitda: number;
    ebitda_margin_percent: number;
  }>;
  executiveAlerts: Array<{
    level: "info" | "warning" | "critical";
    message: string;
  }>;
};

function PnLDashboard() {
  const { brandCode } = useParams();
  const code = String(brandCode || "").toUpperCase();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PnlData | null>(null);
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-07-11");
  const [errorMessage, setErrorMessage] = useState("");

  const money = (value: number) => {
    const amount = Number(value || 0);

    if (Math.abs(amount) >= 1_000_000) {
      return `AED ${(amount / 1_000_000).toFixed(2)}M`;
    }

    if (Math.abs(amount) >= 1_000) {
      return `AED ${(amount / 1_000).toFixed(0)}K`;
    }

    return `AED ${Math.round(amount).toLocaleString()}`;
  };

  const loadPnl = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await getPnlDashboard(code, {
        fromDate,
        toDate,
      });

      setData(result);
    } catch (error: any) {
      console.error("P&L dashboard loading failed:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to load P&L dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      loadPnl();
    }
  }, [code, fromDate, toDate]);

  const monthlyRevenue = useMemo(
    () =>
      (data?.monthlyTrend || []).map((item) => ({
        name: item.month,
        value: Number(item.revenue || 0),
      })),
    [data]
  );

  const monthlyEbitda = useMemo(
    () =>
      (data?.monthlyTrend || []).map((item) => ({
        name: item.month,
        value: Number(item.ebitda || 0),
      })),
    [data]
  );

  const costMix = useMemo(
    () =>
      (data?.costMix || []).map((item) => ({
        name: item.name,
        value: Number(item.value || 0),
      })),
    [data]
  );

  const kpis = data?.kpis || {
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    grossMarginPercent: 0,
    laborCost: 0,
    occupancyCost: 0,
    deliveryFees: 0,
    otherOpex: 0,
    ebitda: 0,
    ebitdaMarginPercent: 0,
  };

  return (
    <BrandLayout
      brandCode={code}
      brandName={data?.brandName || code}
    >
      <div className="min-h-screen bg-[#F4F8F6]">
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C89B3C]">
                CEO Financial View
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-stone-950">
                Profit &amp; Loss Dashboard
              </h1>

              <p className="mt-2 text-sm text-stone-500">
                Revenue, gross margin, operating costs and EBITDA at a glance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DateField
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
              />

              <DateField
                label="To Date"
                value={toDate}
                onChange={setToDate}
              />

              <button
                type="button"
                onClick={loadPnl}
                className="flex h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-xs font-bold text-stone-700"
              >
                <RefreshCw size={14} />
                Refresh
              </button>

              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl bg-[#0F6B52] px-4 text-xs font-bold text-white"
              >
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
            Loading P&amp;L dashboard...
          </div>
        ) : errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <PnlKpi
                title="Revenue"
                value={money(kpis.revenue)}
                subtitle="Selected period"
                icon={<Banknote size={18} />}
              />

              <PnlKpi
                title="Gross Profit"
                value={money(kpis.grossProfit)}
                subtitle={`${kpis.grossMarginPercent.toFixed(1)}% margin`}
                icon={<TrendingUp size={18} />}
              />

              <PnlKpi
                title="COGS"
                value={money(kpis.cogs)}
                subtitle={`${(
                  kpis.revenue
                    ? (kpis.cogs / kpis.revenue) * 100
                    : 0
                ).toFixed(1)}% of revenue`}
                icon={<WalletCards size={18} />}
                accent="gold"
              />

              <PnlKpi
                title="EBITDA"
                value={money(kpis.ebitda)}
                subtitle={`${kpis.ebitdaMarginPercent.toFixed(1)}% margin`}
                icon={<CircleDollarSign size={18} />}
                accent={kpis.ebitda < 0 ? "red" : "green"}
              />

              <PnlKpi
                title="Operating Costs"
                value={money(
                  kpis.laborCost +
                    kpis.occupancyCost +
                    kpis.deliveryFees +
                    kpis.otherOpex
                )}
                subtitle="Labor + occupancy + fees"
                icon={<Building2 size={18} />}
              />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <LineChartCard
                title="Revenue Trend"
                subtitle="Monthly revenue performance"
                data={monthlyRevenue}
              />

              <LineChartCard
                title="EBITDA Trend"
                subtitle="Monthly operating profitability"
                data={monthlyEbitda}
              />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1.3fr]">
              <BarChartCard
                title="Cost Mix"
                subtitle="Main operating cost categories"
                data={costMix}
              />

              <ExecutiveAlerts
                alerts={data?.executiveAlerts || []}
              />
            </section>

            <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Store Profitability
                </h3>

                <p className="text-xs text-stone-500">
                  Revenue, gross profit, EBITDA and margin by location.
                </p>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs uppercase text-stone-400">
                      <th className="py-3">Store</th>
                      <th className="py-3 text-right">Revenue</th>
                      <th className="py-3 text-right">Gross Profit</th>
                      <th className="py-3 text-right">EBITDA</th>
                      <th className="py-3 text-right">EBITDA Margin</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(data?.storePnl || []).map((store) => (
                      <tr
                        key={store.store_code}
                        className="border-b border-stone-100"
                      >
                        <td className="py-4 font-semibold text-stone-900">
                          {store.store_name}
                        </td>

                        <td className="py-4 text-right">
                          {money(store.revenue)}
                        </td>

                        <td className="py-4 text-right">
                          {money(store.gross_profit)}
                        </td>

                        <td
                          className={`py-4 text-right font-bold ${
                            store.ebitda < 0
                              ? "text-red-600"
                              : "text-[#0F6B52]"
                          }`}
                        >
                          {money(store.ebitda)}
                        </td>

                        <td className="py-4 text-right">
                          {store.ebitda_margin_percent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </BrandLayout>
  );
}

function DateField({ label, value, onChange }: any) {
  return (
    <label className="rounded-xl border border-stone-300 bg-white px-3 py-1.5">
      <span className="block text-[10px] font-semibold text-stone-400">
        {label}
      </span>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-xs font-semibold text-stone-700 outline-none"
      />
    </label>
  );
}

function PnlKpi({
  title,
  value,
  subtitle,
  icon,
  accent = "green",
}: any) {
  const style =
    accent === "gold"
      ? "bg-[#FBF4E4] text-[#C89B3C]"
      : accent === "red"
        ? "bg-red-50 text-red-600"
        : "bg-[#E7F3EF] text-[#0F6B52]";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-3 ${style}`}>
          {icon}
        </div>

        <div>
          <p className="text-[11px] font-semibold text-stone-500">
            {title}
          </p>

          <h2 className="mt-1 text-xl font-black text-stone-950">
            {value}
          </h2>

          <p className="mt-1 text-[10px] text-stone-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExecutiveAlerts({ alerts }: { alerts: any[] }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <CircleDollarSign
          size={18}
          className="text-[#C89B3C]"
        />

        <h3 className="text-base font-bold text-stone-900">
          CEO Financial Alerts
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        {alerts.map((alert, index) => (
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

export default PnLDashboard;
