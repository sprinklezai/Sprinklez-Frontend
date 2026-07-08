import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ["#0F6B52", "#C89B3C", "#6B7280", "#D6D3D1"];

function PieChartCard({ title, subtitle, data }: PieChartCardProps) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-stone-900">{title}</h3>
        {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={48}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => {
                const numericValue = Number(value || 0);
                const percent = total
                  ? Math.round((numericValue / total) * 100)
                  : 0;

                return [`AED ${numericValue.toLocaleString()} (${percent}%)`, "Sales"];
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartCard;