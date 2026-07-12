import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getOverview } from "../api/overview";

import BrandCard from "../components/widgets/BrandCard";
import PieChartCard from "../components/charts/PieChartCard";
import BarChartCard from "../components/charts/BarChartCard";

const brandLogoMap: Record<string, string> = {
  ALB: "/brand-logos/allo-beirut.png",
  WSP: "/brand-logos/wingstop.png",
  CSC: "/brand-logos/coldstone.png",
  SLI: "/brand-logos/sushi-library.png",
  NAN: "/brand-logos/nandos.png",
  JMP: "/brand-logos/jamies-pizzeria.png",
  JMT: "/brand-logos/jamies-italian.png",
  MCC: "/brand-logos/molten.png",
};

function Overview() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const data = await getOverview();
        setOverview(data);
      } catch (error) {
        console.error("Overview loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const brandCards = overview?.brandSummary || [];
  const topBrands = overview?.topBrandsByStores || [];
  const countrySummary = overview?.countrySummary || [];

  return (
    <DashboardLayout>
      <div
        className="min-h-screen rounded-3xl px-3 py-4"
        style={{
          background:
            "radial-gradient(circle at 85% 5%, rgba(15,107,82,0.12), transparent 28%), linear-gradient(135deg, #F4F8F6 0%, #EEF6F2 45%, #F8FAF9 100%)",
        }}
      >
        <section className="mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white/85 p-7 shadow-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C89B3C]">
            Executive Overview
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-stone-950">
            Brand Portfolio & Market Footprint
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
            A focused view of the Sprinklez F&amp;B portfolio, country presence
            and store distribution.
          </p>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
            Loading overview data...
          </div>
        ) : (
          <>
            <section className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-stone-900">
                  Our Brand Portfolio
                </h2>
                <p className="text-sm text-stone-500">
                  Select a brand to view its executive sales dashboard.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {brandCards.map((brand: any) => (
                  <BrandCard
                    key={brand.brand_code}
                    name={brand.brand_name}
                    code={brand.brand_code}
                    logo={brandLogoMap[brand.brand_code] || ""}
                    stores={brand.stores}
                    countries={brand.countries}
                  />
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <PieChartCard
                title="Country Contribution"
                subtitle="Store footprint by country"
                data={countrySummary.map((item: any) => ({
                  name: item.country_name,
                  value: Number(item.stores || 0),
                }))}
              />

              <BarChartCard
                title="Brand Contribution by Store Count"
                subtitle="Portfolio concentration by store count"
                data={topBrands.slice(0, 8).map((item: any) => ({
                  name: item.brand_name,
                  value: Number(item.stores || 0),
                }))}
              />
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Overview;
