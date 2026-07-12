import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface StoreSalesRow {
  store_code: string;
  store_name: string;
  country_name?: string;
  company_name?: string;
  net_sales: number;
  orders: number;
  quantity?: number;
  avg_order_value: number;
  avg_daily_sales?: number;
  contribution_percent?: number;
}

interface StoreSalesTableProps {
  data: StoreSalesRow[];
  reportingDays: number;
  pageSize?: number;
}

function StoreSalesTable({
  data,
  reportingDays,
  pageSize = 15,
}: StoreSalesTableProps) {
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        (data || [])
          .map((item) => String(item.country_name || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filteredRows = useMemo(() => {
    const rows =
      selectedCountry === "ALL"
        ? data || []
        : (data || []).filter(
            (item) =>
              String(item.country_name || "").trim() === selectedCountry
          );

    return [...rows].sort(
      (a, b) => Number(b.net_sales || 0) - Number(a.net_sales || 0)
    );
  }, [data, selectedCountry]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, data]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const formatMoney = (value: number) => {
    const amount = Number(value || 0);

    if (Math.abs(amount) >= 1_000_000) {
      return `AED ${(amount / 1_000_000).toFixed(2)}M`;
    }

    if (Math.abs(amount) >= 1_000) {
      return `AED ${(amount / 1_000).toFixed(1)}K`;
    }

    return `AED ${Math.round(amount).toLocaleString()}`;
  };

  const formatNumber = (value: number) =>
    Math.round(Number(value || 0)).toLocaleString();

  const cleanStoreName = (name: string) =>
    String(name || "")
      .replace(/^SLI\s+/i, "")
      .replace(/^WSP\s+/i, "")
      .replace(/^ALB\s+/i, "")
      .replace(/^NAN\s+/i, "")
      .replace(/^CSC\s+/i, "")
      .replace(/^JMP\s+/i, "")
      .replace(/^JMT\s+/i, "")
      .replace(/^MCC\s+/i, "")
      .trim();

  const safeReportingDays = Math.max(1, Number(reportingDays || 1));

  const firstRecord =
    filteredRows.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const lastRecord = Math.min(
    currentPage * pageSize,
    filteredRows.length
  );

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Store Performance
          </p>

          <h3 className="mt-1 text-xl font-extrabold text-stone-950">
            Store-wise Sales
          </h3>

          <p className="mt-1 text-xs text-stone-500">
            Ranked by net revenue for the selected brand and period.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCountry("ALL")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedCountry === "ALL"
                ? "bg-[#0F6B52] text-white"
                : "border border-emerald-100 bg-emerald-50 text-[#0F6B52] hover:bg-emerald-100"
            }`}
          >
            All Countries
          </button>

          {countries.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => setSelectedCountry(country)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                selectedCountry === country
                  ? "bg-[#0F6B52] text-white"
                  : "border border-emerald-100 bg-emerald-50 text-[#0F6B52] hover:bg-emerald-100"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-[11px] uppercase tracking-[0.12em] text-stone-400">
              <th className="w-16 py-3">#</th>
              <th className="py-3">Location</th>
              <th className="py-3">Country</th>
              <th className="py-3 text-right">Revenue</th>
              <th className="py-3 text-right">ADS</th>
              <th className="py-3 text-right">Avg Check</th>
              <th className="py-3 text-right">Avg Daily Txns</th>
              <th className="py-3 text-right">Contribution</th>
            </tr>
          </thead>

          <tbody>
            {pageRows.length > 0 ? (
              pageRows.map((store, index) => {
                const rank =
                  (currentPage - 1) * pageSize + index + 1;

                const avgDailySales =
                  Number(store.avg_daily_sales || 0) ||
                  Number(store.net_sales || 0) / safeReportingDays;

                const avgDailyTransactions =
                  Number(store.orders || 0) / safeReportingDays;

                return (
                  <tr
                    key={`${store.store_code}-${rank}`}
                    className="border-b border-stone-100 transition hover:bg-emerald-50/40"
                  >
                    <td className="py-4 font-bold text-[#C89B3C]">
                      {String(rank).padStart(2, "0")}
                    </td>

                    <td className="py-4">
                      <p className="font-bold text-stone-900">
                        {cleanStoreName(store.store_name)}
                      </p>

                      <p className="mt-0.5 text-[11px] text-stone-400">
                        {store.store_code}
                      </p>
                    </td>

                    <td className="py-4 text-stone-600">
                      {store.country_name || "Unknown"}
                    </td>

                    <td className="py-4 text-right font-bold text-stone-900">
                      {formatMoney(store.net_sales)}
                    </td>

                    <td className="py-4 text-right font-semibold text-[#0F6B52]">
                      {formatMoney(avgDailySales)}
                    </td>

                    <td className="py-4 text-right text-stone-700">
                      {formatMoney(store.avg_order_value)}
                    </td>

                    <td className="py-4 text-right text-stone-700">
                      {formatNumber(avgDailyTransactions)}
                    </td>

                    <td className="py-4 text-right text-stone-700">
                      {Number(store.contribution_percent || 0).toFixed(1)}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-sm text-stone-500"
                >
                  No stores found for the selected country.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone-500">
          Showing {firstRecord}–{lastRecord} of {filteredRows.length} stores
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-stone-200 p-2 text-stone-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={currentPage === 1}
            className="rounded-lg border border-stone-200 p-2 text-stone-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-[100px] text-center text-xs font-semibold text-stone-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            disabled={currentPage === totalPages}
            className="rounded-lg border border-stone-200 p-2 text-stone-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-stone-200 p-2 text-stone-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default StoreSalesTable;
