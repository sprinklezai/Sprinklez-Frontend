import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: ReactNode;
  accent?: "blue" | "green" | "purple" | "orange" | "red";
}

const colors = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
};

function KpiCard({ title, value, subtitle, icon, accent = "blue" }: KpiCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-5">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors[accent]}`}>
          {icon}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
          <p className="mt-1 font-semibold text-slate-700">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default KpiCard;