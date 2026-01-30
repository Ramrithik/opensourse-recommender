// server.js (backend/server.js)
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// 👇 change this line
const githubRoutes = require("./routes/github");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
