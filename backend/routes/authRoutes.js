const express = require("express");
const router = express.Router();

const { getData } = require("../services/excelService");

router.post("/login", (req, res) => {
  try {
    const { emp_id, password } = req.body;

    if (!emp_id || !password) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and password are required",
      });
    }

    const users = getData("users");
    const employees = getData("employee");

    const user = users.find(
      (u) => String(u.Emp_ID) === String(emp_id)
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Employee ID or Password",
      });
    }

    if (String(user.IsActive).toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    if (String(user.Password) !== String(password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Employee ID or Password",
      });
    }

    const employee = employees.find(
      (e) => String(e.emp_code) === String(emp_id)
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        emp_id: employee.emp_code,
        emp_name: employee.emp_name,
        designation: employee.emp_designation,
        role: user.Role,
        status: user.IsActive,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed due to server error",
    });
  }
});

module.exports = router;