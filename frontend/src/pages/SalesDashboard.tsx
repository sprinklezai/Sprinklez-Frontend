import { useParams } from "react-router-dom";
import {
  Banknote,
  Receipt,
  Percent,
  ShoppingBag,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import FilterBar from "../components/widgets/FilterBar";
import KpiCard from "../components/widgets/KpiCard";

const brandNameMap: Record<string, string> = {
  ALB: "Allo Beirut",
  WSP: "Wingstop",
  CSC: "Cold Stone Creamery",
  SLI: "Sushi Library",
  NAN: "Nando's",
  JMP: "Jamie's Pizzeria",
  JMT: "Jamie's Italian",
  MCC: "Molten Chocolate Café",
};

function SalesDashboard() {
  const { brandCode } = useParams();

  const code = String(brandCode || "").toUpperCase();
  const brandName = brandNameMap[code] || code;

  return (
    <BrandLayout brandCode={code} brandName={brandName}>
      <section className="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Sales Dashboard
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900">
          {brandName} Sales Performance
        </h1>

        <p className="mt-3 max-w-3xl text-slate-500">
          Executive sales overview with revenue, orders, average order value,
          discounts, trends, channel mix and outlet ranking.
        </p>
      </section>

      <FilterBar
        brandName={brandName}
        countries={[]}
        companies={[]}
        stores={[]}
        selectedCountry=""
        selectedCompany=""
        selectedStore=""
        onCountryChange={() => {}}
        onCompanyChange={() => {}}
        onStoreChange={() => {}}
        onReset={() => {}}
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Net Revenue"
          value="د.ك 45.42M"
          subtitle="0.0% vs prior"
          icon={<Banknote size={30} />}
          accent="green"
        />

        <KpiCard
          title="Orders"
          value="280,489"
          subtitle="0.0% vs prior"
          icon={<Receipt size={30} />}
          accent="blue"
        />

        <KpiCard
          title="Avg Order Value"
          value="د.ك 162.0"
          subtitle="Per transaction"
          icon={<ShoppingBag size={30} />}
          accent="orange"
        />

        <KpiCard
          title="Discounts"
          value="د.ك 3.70M"
          subtitle="8.2% of net revenue"
          icon={<Percent size={30} />}
          accent="red"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Revenue Trend
              </h3>
              <p className="text-sm text-slate-500">
                Net revenue by month vs prior period
              </p>
            </div>

            <button className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
              Compare prior
            </button>
          </div>

          <div className="mt-8 flex h-72 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            Revenue Trend Chart
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Revenue by Region
          </h3>
          <p className="text-sm text-slate-500">
            Click a region to drill in
          </p>

          <div className="mt-6 space-y-5">
            {[
              ["United Arab Emirates", "د.ك 12.8M", 95],
              ["Qatar", "د.ك 11.4M", 82],
              ["Saudi Arabia", "د.ك 10.9M", 78],
              ["Bahrain", "د.ك 4.2M", 36],
            ].map(([name, value, width]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    {name}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-700"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Average Daily Sales / Outlet
          </h3>
          <p className="text-sm text-slate-500">
            Monthly average sales per outlet
          </p>

          <div className="mt-8 flex h-72 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            ADS Line Chart
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Channel Mix</h3>
          <p className="text-sm text-slate-500">
            Dine-in vs Delivery & Takeaway
          </p>

          <div className="mt-8">
            <p className="text-5xl font-extrabold text-emerald-700">69%</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Dine-in
            </p>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-amber-600">
              <div className="h-full w-[69%] bg-emerald-700" />
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Dine-in</span>
                <strong>د.ك 31.22M</strong>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Takeaway</span>
                <strong>د.ك 14.20M</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Locations by Sales
            </h3>
            <p className="text-sm text-slate-500">
              Top outlets by average daily sales
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-1">
            <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold">
              Top 10
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-slate-500">
              Bottom 10
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3">#</th>
                <th className="py-3">Location</th>
                <th className="py-3">Country</th>
                <th className="py-3">ADS</th>
                <th className="py-3">Avg Check</th>
                <th className="py-3">Avg Daily Orders</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["01", "Dubai Hills", "UAE", "د.ك 22.7K", "د.ك 180", "126"],
                ["02", "Doha Festival City", "Qatar", "د.ك 19.7K", "د.ك 190", "104"],
                ["03", "Doha City Centre", "Qatar", "د.ك 15.5K", "د.ك 165", "94"],
                ["04", "Nakheel Mall - Riyadh", "Saudi", "د.ك 13.7K", "د.ك 197", "70"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-slate-100">
                  <td className="py-4 font-bold text-amber-700">{row[0]}</td>
                  <td className="py-4 font-semibold text-slate-800">{row[1]}</td>
                  <td className="py-4 text-slate-500">{row[2]}</td>
                  <td className="py-4 font-semibold">{row[3]}</td>
                  <td className="py-4">{row[4]}</td>
                  <td className="py-4">{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </BrandLayout>
  );
}

export default SalesDashboard;