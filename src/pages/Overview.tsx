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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setErrorMessage("");
        const data = await getOverview();
        setOverview(data);
      } catch (error) {
        console.error("Overview loading failed:", error);
        setErrorMessage("Unable to load overview data.");
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
      <div className="min-h-screen bg-[#F7F8FA] px-1 py-2">
        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
            Loading overview data...
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : (
          <>
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C89B3C]">
                  Executive Portfolio
                </p>
                <h1 className="mt-2 text-2xl font-extrabold text-stone-950">
                  Our Brand Portfolio
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                  Select a brand to view its detailed performance dashboard.
                </p>
              </div>

              {brandCards.length > 0 ? (
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
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-500">
                  No brand portfolio data is available.
                </div>
              )}
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
                subtitle="Top brands by number of stores"
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
