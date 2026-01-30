const axios = require("axios");

const BASE_URL = "https://api.github.com";

async function fetchGitHubProfile(username) {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "ai-task-manager-pro",
    Accept: "application/vnd.github+json",
  };

  const user = await axios.get(`${BASE_URL}/users/${username}`, { headers });
  const repos = await axios.get(
    `${BASE_URL}/users/${username}/repos?per_page=100`,
    { headers }
  );

  return {
    profile: user.data,
    repos: repos.data,
  };
}

module.exports = { fetchGitHubProfile };
