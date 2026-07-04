import { RefreshCw, Download, Search, MapPin, Globe } from "lucide-react";

export default function FilterBar({
  title,
  subtitle,
  period,
  onPeriodChange,
  search,
  onSearchChange,
  onRefresh,
  refreshing,
  onExport,
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-5 border-b border-line">
      <div>
        <h1 className="text-[19px] font-bold text-ink leading-tight">{title}</h1>
        <p className="text-[12.5px] text-muted mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-line bg-white text-[13px] text-ink hover:bg-cream">
          <MapPin size={14} /> All Locations
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-line bg-white text-[13px] text-ink hover:bg-cream">
          <Globe size={14} /> All Countries
        </button>

        <div className="flex items-center bg-brand-light/60 rounded-md p-0.5 border border-line">
          {["WTD", "MTD", "YTD"].map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={`px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
                period === p ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {onSearchChange && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-line bg-white text-[13px] text-muted">
            <Search size={14} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="outline-none bg-transparent w-32 text-ink placeholder:text-muted"
            />
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-line bg-white text-[13px] text-ink hover:bg-cream disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-brand-dark text-white text-[13px] font-medium hover:bg-brand"
        >
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
}
