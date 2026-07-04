const express = require("express");
const { requireAuth } = require("../middleware/auth");
const excelService = require("../services/excelService");

const router = express.Router();
router.use(requireAuth);

// Manual "Refresh Data" button hits this endpoint
router.post("/refresh", async (req, res) => {
  try {
    const cache = await excelService.refreshFromDrive();
    res.json({ ok: true, lastSynced: cache.lastSynced });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Refresh failed: " + err.message });
  }
});

router.get("/status", (req, res) => {
  const cache = excelService.getCache();
  res.json({ lastSynced: cache.lastSynced });
});

router.get("/overview", (req, res) => {
  res.json({
    org: excelService.getOrgOverview(),
    storesByCountry: excelService.getStoresByCountry(),
    contributionByRegion: excelService.getContributionByRegion(),
    contributionByBrand: excelService.getContributionByBrand(),
    brands: excelService.getBrandList(),
    lastSynced: excelService.getCache().lastSynced,
  });
});

router.get("/stores", (req, res) => {
  const { status } = req.query;
  res.json(excelService.getStoreDirectory({ status }));
});

router.get("/brands", (req, res) => {
  res.json(excelService.getBrandList());
});

router.get("/brands/:brand", (req, res) => {
  const { period } = req.query;
  res.json(excelService.getBrandDashboard(req.params.brand, { period }));
});

module.exports = router;
