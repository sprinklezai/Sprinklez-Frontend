import { useMemo, useState } from "react";

interface MonthlyRevenuePoint {
  month: string;
  label: string;
  current: number;
  prior: number;
}

interface RegionRevenuePoint {
  name: string;
  value: number;
}

interface RevenueComparisonPanelProps {
  monthlyData: MonthlyRevenuePoint[];
  regionData: RegionRevenuePoint[];
  currency?: string;
}

function RevenueComparisonPanel({
  monthlyData,
  regionData,
  currency = "AED",
}: RevenueComparisonPanelProps) {
  const [comparePrior, setComparePrior] = useState(true);

  const maxMonthly = useMemo(() => {
    const values = monthlyData.flatMap((item) =>
      comparePrior ? [item.current, item.prior] : [item.current]
    );
    return Math.max(...values, 1);
  }, [monthlyData, comparePrior]);

  const maxRegion = useMemo(
    () => Math.max(...(regionData || []).map((item) => Number(item.value || 0)), 1),
    [regionData]
  );

  const formatMoney = (value: number) => {
    const amount = Number(value || 0);
    if (Math.abs(amount) >= 1_000_000) {
      return `${currency} ${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${currency} ${(amount / 1_000).toFixed(1)}K`;
    }
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[1.9fr_1fr]">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-950">
              Revenue Trend
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Monthly net revenue compared with the same period last year
            </p>
          </div>

          <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#0F6B52]">
            <button
              type="button"
              role="switch"
              aria-checked={comparePrior}
              onClick={() => setComparePrior((value) => !value)}
              className={`relative h-5 w-9 rounded-full transition ${
                comparePrior ? "bg-[#0F6B52]" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                  comparePrior ? "left-[18px]" : "left-0.5"
                }`}
              />
            </button>
            Compare prior
          </label>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-[650px] items-end gap-8">
            {monthlyData.map((item) => {
              const currentHeight = Math.max(
                4,
                (Number(item.current || 0) / maxMonthly) * 180
              );
              const priorHeight = Math.max(
                4,
                (Number(item.prior || 0) / maxMonthly) * 180
              );

              return (
                <div key={item.month} className="flex min-w-[72px] flex-1 flex-col items-center">
                  <div className="mb-3 flex w-full justify-center gap-2 text-[11px] font-bold text-stone-800">
                    {comparePrior && <span>{formatMoney(item.prior)}</span>}
                    <span>{formatMoney(item.current)}</span>
                  </div>

                  <div className="flex h-[190px] items-end justify-center gap-2">
                    {comparePrior && (
                      <div
                        title={`Prior: ${formatMoney(item.prior)}`}
                        className="w-7 rounded-t-md bg-[#DCE7E2] transition-all duration-300"
                        style={{ height: `${priorHeight}px` }}
                      />
                    )}
                    <div
                      title={`Current: ${formatMoney(item.current)}`}
                      className="w-7 rounded-t-md bg-[#0F6B52] transition-all duration-300"
                      style={{ height: `${currentHeight}px` }}
                    />
                  </div>

                  <p className="mt-3 text-xs font-medium text-stone-500">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-5 border-t border-stone-100 pt-4 text-xs text-stone-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#0F6B52]" />
            Current period
          </span>
          {comparePrior && (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#DCE7E2]" />
              Prior-year period
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-stone-950">
          Revenue by Region
        </h3>
        <p className="mt-1 text-xs text-stone-500">
          Country contribution for the selected filters
        </p>

        <div className="mt-7 space-y-5">
          {(regionData || []).slice(0, 8).map((item, index) => {
            const width = (Number(item.value || 0) / maxRegion) * 100;

            return (
              <div key={`${item.name}-${index}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="truncate text-xs font-semibold text-stone-700">
                    {item.name}
                  </p>
                  <p className="whitespace-nowrap text-xs font-bold text-stone-900">
                    {formatMoney(item.value)}
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0F6B52] to-[#4FAE87]"
                    style={{ width: `${Math.max(width, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RevenueComparisonPanel;
