const express = require("express");
const router = express.Router();

const { getData } = require("../services/excelService");

router.get("/overview", (req, res) => {
  try {
    const brands = getData("brands");
    const companies = getData("companies");
    const countries = getData("countries");
    const stores = getData("stores");
    const employees = getData("employee");

    const activeStores = stores.filter((store) => {
      const status = String(store.status || "").trim().toLowerCase();
      return status === "yes" || status === "active";
    }).length;

    const inactiveStores = stores.filter((store) => {
      const status = String(store.status || "").trim().toLowerCase();
      return status === "no" || status === "inactive";
    }).length;

    const brandSummary = brands.map((brand) => {
      const brandCode = String(brand.brand_code || "").trim().toUpperCase();

      const brandStores = stores.filter(
        (store) =>
          String(store.brand_code || "").trim().toUpperCase() === brandCode
      );

      const uniqueCountries = new Set(
        brandStores
          .map((store) =>
            String(store.country_code || "").trim().toUpperCase()
          )
          .filter(Boolean)
      );

      return {
        brand_code: brandCode,
        brand_name: brand.brand_name || brand.brand_desc || brandCode,
        brand_desc: brand.brand_desc || "",
        stores: brandStores.length,
        countries: uniqueCountries.size,
      };
    });

    const topBrandsByStores = [...brandSummary].sort(
      (a, b) => b.stores - a.stores
    );

    res.json({
      success: true,
      kpis: {
        stores: stores.length,
        brands: brands.length,
        companies: companies.length,
        countries: countries.length,
        employees: employees.length,
        activeStores,
        inactiveStores,
      },
      brandSummary,
      topBrandsByStores,
    });
  } catch (error) {
    console.error("Overview API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load overview data",
    });
  }
});

module.exports = router;