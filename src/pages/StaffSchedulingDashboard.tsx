import {
  CalendarDays,
  Clock3,
  Settings2,
  Store,
  TrendingUp,
  Upload,
  UsersRound,
} from "lucide-react";
import { useParams } from "react-router-dom";

import BrandLayout from "../layouts/BrandLayout";

function StaffSchedulingDashboard() {
  const { brandCode } = useParams();
  const code = String(brandCode || "").toUpperCase();

  return (
    <BrandLayout
      brandCode={code}
      brandName={code}
    >
      <div className="min-h-screen bg-[#F4F8F6]">
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C89B3C]">
                Labour Optimization
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-stone-950">
                Staff Scheduling
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
                Plan weekly manpower using historic sales, transactions,
                operating hours, staff availability and brand-specific
                productivity rules.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-xs font-bold text-stone-700"
              >
                <Upload size={15} />
                Upload Staff Master
              </button>

              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl bg-[#0F6B52] px-4 text-xs font-bold text-white"
              >
                <CalendarDays size={15} />
                Generate Weekly Plan
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <KpiCard
            title="Available Employees"
            value="—"
            subtitle="Active staff for selected store"
            icon={<UsersRound size={18} />}
          />

          <KpiCard
            title="Recommended Staff"
            value="—"
            subtitle="Based on forecast demand"
            icon={<TrendingUp size={18} />}
          />

          <KpiCard
            title="Peak Business Day"
            value="—"
            subtitle="Historic strongest weekday"
            icon={<CalendarDays size={18} />}
            tone="gold"
          />

          <KpiCard
            title="Peak Hour"
            value="—"
            subtitle="Highest transaction demand"
            icon={<Clock3 size={18} />}
            tone="blue"
          />

          <KpiCard
            title="Target Productivity"
            value="AED 1,000"
            subtitle="Revenue per staff per day"
            icon={<Settings2 size={18} />}
          />

          <KpiCard
            title="Minimum Productivity"
            value="AED 800"
            subtitle="Minimum daily benchmark"
            icon={<Store size={18} />}
            tone="red"
          />
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_1fr]">
          <PlaceholderCard
            title="Weekly Demand & Staffing"
            subtitle="Recommended manpower from Monday to Sunday"
            message="Phase 2 will connect historic daily sales and calculate recommended staff by weekday."
          />

          <PlaceholderCard
            title="Hourly Staffing Requirement"
            subtitle="Required staff versus scheduled staff"
            message="Phase 2 will use hourly transactions from LS Retail Transaction Header."
          />
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          <RuleCard
            title="Sushi Library"
            type="Casual Dining"
            points={[
              "Lower transactions per staff hour",
              "Minimum FOH and BOH coverage",
              "Table service and runner roles",
              "Kitchen station skill requirements",
            ]}
          />

          <RuleCard
            title="Cold Stone"
            type="QSR"
            points={[
              "Higher transactions per staff hour",
              "Lean opening coverage",
              "Peak queue and production coverage",
              "Fast service productivity model",
            ]}
          />

          <RuleCard
            title="Common Labour Rules"
            type="UAE Planning"
            points={[
              "48 productive hours per week",
              "9-hour continuous shift",
              "1-hour break",
              "No split shifts",
            ]}
          />
        </section>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-stone-950">
            Build Roadmap
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <RoadmapStep
              number="1"
              title="Staff Master"
              text="Upload, validate and maintain employees by brand, store, role and skill."
              active
            />

            <RoadmapStep
              number="2"
              title="Historic Demand"
              text="Calculate sales and transactions by weekday and hour."
            />

            <RoadmapStep
              number="3"
              title="Staff Requirement"
              text="Apply brand rules, productivity and minimum role coverage."
            />

            <RoadmapStep
              number="4"
              title="Weekly Roster"
              text="Assign employees, shifts, breaks and weekday offs."
            />
          </div>
        </section>
      </div>
    </BrandLayout>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  tone = "green",
}: any) {
  const styles: Record<string, string> = {
    green: "bg-emerald-50 text-[#0F6B52]",
    gold: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-3 ${styles[tone]}`}>
          {icon}
        </div>

        <div>
          <p className="text-[11px] font-semibold text-stone-500">
            {title}
          </p>

          <p className="mt-1 text-xl font-black text-stone-950">
            {value}
          </p>

          <p className="mt-1 text-[10px] leading-4 text-stone-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({
  title,
  subtitle,
  message,
}: any) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-extrabold text-stone-950">
        {title}
      </h3>

      <p className="mt-1 text-xs text-stone-500">
        {subtitle}
      </p>

      <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-center">
        <div>
          <TrendingUp
            size={32}
            className="mx-auto text-[#0F6B52]"
          />

          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function RuleCard({
  title,
  type,
  points,
}: {
  title: string;
  type: string;
  points: string[];
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C89B3C]">
        {type}
      </p>

      <h3 className="mt-2 text-lg font-extrabold text-stone-950">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className="flex gap-2 text-xs leading-5 text-stone-600"
          >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0F6B52]" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapStep({
  number,
  title,
  text,
  active = false,
}: any) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-emerald-300 bg-emerald-50"
          : "border-stone-200 bg-stone-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white ${
          active ? "bg-[#0F6B52]" : "bg-stone-400"
        }`}
      >
        {number}
      </span>

      <h4 className="mt-4 text-sm font-bold text-stone-900">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-stone-500">
        {text}
      </p>
    </div>
  );
}

export default StaffSchedulingDashboard;
