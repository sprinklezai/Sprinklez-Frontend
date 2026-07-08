interface SalesFilterBarProps {
  brandName: string;
  month: string;
  onMonthChange: (value: string) => void;
  onRefresh: () => void;
}

function SalesFilterBar({
  brandName,
  month,
  onMonthChange,
  onRefresh,
}: SalesFilterBarProps) {
  return (
    <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Business Overview
          </h2>
          <p className="text-sm text-slate-500">
            {brandName} · All countries · Selected period
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select className="rounded-xl border border-slate-300 px-4 py-3 text-sm">
            <option>All Locations</option>
          </select>

          <select className="rounded-xl border border-slate-300 px-4 py-3 text-sm">
            <option>All Countries</option>
          </select>

          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          >
            <option value="2026_06">Jun 2026</option>
          </select>

          <input
            placeholder="Search products..."
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />

          <button
            onClick={onRefresh}
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </section>
  );
}

export default SalesFilterBar;