import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: {
    name: string;
    value: number;
  }[];
}

function BarChartCard({ title, subtitle, data }: BarChartCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-stone-900">{title}</h3>
        {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fontSize: 11 }}
              stroke="#78716C"
            />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#0F6B52" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartCard;