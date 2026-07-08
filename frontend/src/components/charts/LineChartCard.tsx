import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: {
    name: string;
    value: number;
  }[];
}

function LineChartCard({ title, subtitle, data }: LineChartCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-stone-900">{title}</h3>
        {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0F6B52"
              fill="#DDEFE8"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartCard;