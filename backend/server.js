const express = require('express');
const cors = require('cors');
require('dotenv').config();

const githubRoutes = require('./routes/github');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/github', githubRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});