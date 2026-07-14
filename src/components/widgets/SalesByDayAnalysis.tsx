import { useMemo } from "react";
import {
  CalendarCheck2,
  CalendarX2,
  Receipt,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface TrendPoint {
  date: string;
  value: number;
}

interface SalesByDayAnalysisProps {
  revenueData?: TrendPoint[];
  ordersData?: TrendPoint[];
  currency?: string;
}

const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function SalesByDayAnalysis({
  revenueData = [],
  ordersData = [],
  currency = "AED",
}: SalesByDayAnalysisProps) {
  const analysis = useMemo(() => {
    const ordersMap = new Map(
      ordersData.map((item) => [
        String(item.date || ""),
        Number(item.value || 0),
      ])
    );

    const dailyRows = revenueData
      .map((item) => {
        const date = String(item.date || "");
        const revenue = Number(item.value || 0);
        const orders = Number(ordersMap.get(date) || 0);
        const parsedDate = new Date(`${date}T00:00:00`);

        return {
          date,
          revenue,
          orders,
          averageCheck:
            orders > 0 ? revenue / orders : 0,
          weekday: Number.isNaN(parsedDate.getTime())
            ? "Unknown"
            : parsedDate.toLocaleDateString("en-US", {
                weekday: "long",
              }),
          displayDate: Number.isNaN(parsedDate.getTime())
            ? date
            : parsedDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              }),
        };
      })
      .filter((item) => item.date)
      .sort((a, b) => a.date.localeCompare(b.date));

    const rankedDays = [...dailyRows].sort(
      (a, b) => b.revenue - a.revenue
    );

    const weekdayMap = new Map<
      string,
      {
        weekday: string;
        revenue: number;
        orders: number;
        days: number;
      }
    >();

    for (const row of dailyRows) {
      if (!weekdayMap.has(row.weekday)) {
        weekdayMap.set(row.weekday, {
          weekday: row.weekday,
          revenue: 0,
          orders: 0,
          days: 0,
        });
      }

      const weekday = weekdayMap.get(row.weekday)!;
      weekday.revenue += row.revenue;
      weekday.orders += row.orders;
      weekday.days += 1;
    }

    const weekdayPerformance = Array.from(
      weekdayMap.values()
    )
      .map((item) => ({
        ...item,
        averageRevenue:
          item.days > 0 ? item.revenue / item.days : 0,
        averageOrders:
          item.days > 0 ? item.orders / item.days : 0,
        averageCheck:
          item.orders > 0
            ? item.revenue / item.orders
            : 0,
      }))
      .sort(
        (a, b) =>
          weekdayOrder.indexOf(a.weekday) -
          weekdayOrder.indexOf(b.weekday)
      );

    const strongestWeekday = [...weekdayPerformance].sort(
      (a, b) => b.averageRevenue - a.averageRevenue
    )[0];

    const weakestWeekday = [...weekdayPerformance].sort(
      (a, b) => a.averageRevenue - b.averageRevenue
    )[0];

    const averageDailyRevenue =
      dailyRows.length > 0
        ? dailyRows.reduce(
            (sum, item) => sum + item.revenue,
            0
          ) / dailyRows.length
        : 0;

    const aboveAverageDays = dailyRows.filter(
      (item) => item.revenue >= averageDailyRevenue
    ).length;

    return {
      dailyRows,
      rankedDays,
      weekdayPerformance,
      bestDay: rankedDays[0],
      weakestDay:
        rankedDays[rankedDays.length - 1],
      strongestWeekday,
      weakestWeekday,
      averageDailyRevenue,
      aboveAverageDays,
    };
  }, [revenueData, ordersData]);

  const maximumWeekdayRevenue = Math.max(
    ...analysis.weekdayPerformance.map(
      (item) => item.averageRevenue
    ),
    1
  );

  if (analysis.dailyRows.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={18}
              className="text-[#C89B3C]"
            />

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C89B3C]">
              Business Day Intelligence
            </p>
          </div>

          <h3 className="mt-2 text-xl font-extrabold text-stone-950">
            Sales by Day Analysis
          </h3>

          <p className="mt-1 text-xs text-stone-500">
            Identify the strongest trading days and
            recurring weekday opportunities.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Days Above Average
          </p>

          <p className="mt-1 text-xl font-black text-[#0F6B52]">
            {analysis.aboveAverageDays} /{" "}
            {analysis.dailyRows.length}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="Best Trading Day"
          value={analysis.bestDay?.displayDate || "—"}
          detail={formatMoney(
            analysis.bestDay?.revenue || 0,
            currency
          )}
          icon={<CalendarCheck2 size={18} />}
          tone="green"
        />

        <InsightCard
          title="Weakest Trading Day"
          value={analysis.weakestDay?.displayDate || "—"}
          detail={formatMoney(
            analysis.weakestDay?.revenue || 0,
            currency
          )}
          icon={<CalendarX2 size={18} />}
          tone="red"
        />

        <InsightCard
          title="Strongest Weekday"
          value={
            analysis.strongestWeekday?.weekday || "—"
          }
          detail={`${formatMoney(
            analysis.strongestWeekday
              ?.averageRevenue || 0,
            currency
          )} avg`}
          icon={<TrendingUp size={18} />}
          tone="gold"
        />

        <InsightCard
          title="Average Daily Revenue"
          value={formatMoney(
            analysis.averageDailyRevenue,
            currency
          )}
          detail={`${analysis.dailyRows.length} trading days`}
          icon={<Receipt size={18} />}
          tone="blue"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Weekday Performance
              </h4>

              <p className="mt-1 text-[11px] text-stone-500">
                Average revenue by weekday
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-stone-500 shadow-sm">
              Selected period
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {analysis.weekdayPerformance.map(
              (item) => {
                const width =
                  (item.averageRevenue /
                    maximumWeekdayRevenue) *
                  100;

                return (
                  <div key={item.weekday}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-stone-700">
                        {item.weekday}
                      </p>

                      <div className="text-right">
                        <p className="text-xs font-bold text-stone-950">
                          {formatMoney(
                            item.averageRevenue,
                            currency
                          )}
                        </p>

                        <p className="text-[10px] text-stone-400">
                          {Math.round(
                            item.averageOrders
                          ).toLocaleString()}{" "}
                          avg orders
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-200/70">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0F6B52] to-[#55B78E]"
                        style={{
                          width: `${Math.max(
                            width,
                            3
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-5">
          <h4 className="text-sm font-bold text-stone-900">
            Top Business Days
          </h4>

          <p className="mt-1 text-[11px] text-stone-500">
            Highest-revenue dates in the selected period
          </p>

          <div className="mt-4 divide-y divide-stone-200">
            {analysis.rankedDays
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={item.date}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-3 py-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F6B52] text-[10px] font-black text-white">
                    {index + 1}
                  </span>

                  <div>
                    <p className="text-xs font-bold text-stone-900">
                      {item.weekday},{" "}
                      {item.displayDate}
                    </p>

                    <p className="mt-0.5 text-[10px] text-stone-400">
                      {Math.round(
                        item.orders
                      ).toLocaleString()}{" "}
                      orders · AOV{" "}
                      {formatMoney(
                        item.averageCheck,
                        currency
                      )}
                    </p>
                  </div>

                  <p className="text-xs font-black text-[#0F6B52]">
                    {formatMoney(
                      item.revenue,
                      currency
                    )}
                  </p>
                </div>
              ))}
          </div>

          {analysis.strongestWeekday &&
            analysis.weakestWeekday && (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
                  Management Insight
                </p>

                <p className="mt-2 text-xs leading-5 text-amber-900">
                  {analysis.strongestWeekday.weekday} is
                  the strongest recurring business day.
                  Consider concentrating campaigns,
                  staffing and stock planning around this
                  pattern. Review{" "}
                  {analysis.weakestWeekday.weekday} for
                  traffic-building opportunities.
                </p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  title,
  value,
  detail,
  icon,
  tone,
}: any) {
  const styles: Record<string, string> = {
    green:
      "border-emerald-100 bg-emerald-50 text-[#0F6B52]",
    red:
      "border-red-100 bg-red-50 text-red-600",
    gold:
      "border-amber-100 bg-amber-50 text-amber-600",
    blue:
      "border-sky-100 bg-sky-50 text-sky-600",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white/80 p-2.5 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
            {title}
          </p>

          <p className="mt-1 text-lg font-black">
            {value}
          </p>

          <p className="mt-1 text-[11px] font-semibold opacity-80">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatMoney(
  value: number,
  currency: string
) {
  const amount = Number(value || 0);

  if (Math.abs(amount) >= 1_000_000) {
    return `${currency} ${(amount / 1_000_000).toFixed(
      2
    )}M`;
  }

  if (Math.abs(amount) >= 1_000) {
    return `${currency} ${(amount / 1_000).toFixed(
      0
    )}K`;
  }

  return `${currency} ${Math.round(
    amount
  ).toLocaleString()}`;
}

export default SalesByDayAnalysis;
