const express = require("express");
const jwt = require("jsonwebtoken");
const excelService = require("../services/excelService");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    // If we've never synced yet, pull data from Drive once automatically
    // so a fresh deployment can still log in without a manual refresh first.
    if (!excelService.getCache().lastSynced) {
      await excelService.refreshFromDrive();
    }

    const employee = excelService.findEmployee(username, password);
    if (!employee) {
      return res.status(401).json({ error: "Incorrect username or password." });
    }

    const token = jwt.sign(
      { username: employee.username, name: employee.name || employee.username, role: employee.role || "Viewer" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token, user: { username: employee.username, name: employee.name, role: employee.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not verify credentials. " + err.message });
  }
});

module.exports = router;
