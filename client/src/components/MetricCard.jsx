import { ArrowUp, ArrowDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function MetricCard({ label, value, delta, trendData, trendColor = "#1f5c47" }) {
  const positive = delta === undefined ? null : delta >= 0;
  return (
    <div className="bg-card rounded-card shadow-card border border-line p-4 flex flex-col gap-2">
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-[22px] font-bold text-ink leading-none">{value}</div>
        {trendData && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <Line type="monotone" dataKey="value" stroke={trendColor} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 text-[12px] font-medium ${positive ? "text-brand" : "text-red-500"}`}>
          {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(delta).toFixed(1)}% vs prior
        </div>
      )}
    </div>
  );
}
