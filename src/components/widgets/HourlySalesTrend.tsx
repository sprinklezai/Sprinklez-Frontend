import { useMemo, useState } from "react";

type Mode = "revenue" | "orders" | "aov";

function HourlySalesTrend({ data, currency = "AED" }: { data: any[]; currency?: string }) {
  const [mode, setMode] = useState<Mode>("revenue");

  const prepared = useMemo(() => (data || []).map((item) => ({
    ...item,
    label: `${String(item.hour).padStart(2, "0")}:00`,
    selectedValue: mode === "orders"
      ? Number(item.orders || 0)
      : mode === "aov"
        ? Number(item.avg_order_value || 0)
        : Number(item.net_sales || 0),
  })), [data, mode]);

  const maxValue = Math.max(...prepared.map((item) => item.selectedValue), 1);

  const formatValue = (value: number) => {
    if (mode === "orders") return Math.round(value).toLocaleString();
    if (Math.abs(value) >= 1000000) return `${currency} ${(value / 1000000).toFixed(2)}M`;
    if (Math.abs(value) >= 1000) return `${currency} ${(value / 1000).toFixed(1)}K`;
    return `${currency} ${Math.round(value).toLocaleString()}`;
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-extrabold text-stone-950">Hourly Sales Trend</h3>
          <p className="mt-1 text-xs text-stone-500">Revenue, orders and average order value by hour</p>
        </div>
        <div className="flex rounded-xl border border-emerald-200 bg-emerald-50 p-1">
          {[["revenue", "Revenue"], ["orders", "Orders"], ["aov", "AOV"]].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setMode(value as Mode)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mode === value ? "bg-[#0F6B52] text-white" : "text-[#0F6B52]"}`}>{label}</button>
          ))}
        </div>
      </div>

      {prepared.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <p className="text-sm font-semibold text-stone-700">Hourly data is not available yet.</p>
          <p className="mt-1 text-xs text-stone-500">Add hourly_sales to the summary builders to activate this chart.</p>
        </div>
      ) : (
        <div className="mt-7 overflow-x-auto">
          <div className="flex min-w-[850px] items-end gap-3">
            {prepared.map((item) => (
              <div key={item.label} className="flex min-w-[42px] flex-1 flex-col items-center">
                <p className="mb-2 text-[10px] font-bold text-stone-600">{formatValue(item.selectedValue)}</p>
                <div className="flex h-44 items-end"><div className="w-7 rounded-t-md bg-[#0F6B52]" style={{ height: `${Math.max(4, (item.selectedValue / maxValue) * 170)}px` }} /></div>
                <p className="mt-2 text-[10px] text-stone-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default HourlySalesTrend;
