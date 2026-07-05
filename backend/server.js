const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// sample API
app.get("/api/status", (req, res) => {
    res.json({
        status: "OK",
        time: new Date()
    });
});

// IMPORTANT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});