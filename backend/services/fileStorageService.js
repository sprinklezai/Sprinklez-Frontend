const fs = require("fs");
const path = require("path");

const SALES_PATH =
  process.env.SALES_DATA_PATH ||
  path.join(__dirname, "..", "data", "sales", "monthly");

async function loadSalesZip(month = "2026_06") {
  const filePath = path.join(SALES_PATH, `${month}_sales.zip`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Sales ZIP not found: ${filePath}`);
  }

  return fs.readFileSync(filePath);
}

module.exports = {
  loadSalesZip,
};