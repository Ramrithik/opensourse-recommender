const axios = require("axios");
async function recommendRepos(level, languages) {
  let label = "good first issue";
  if (level === "Intermediate") label = "help wanted";
  if (level === "Advanced") label = "open source";
  const langQuery = languages.map((l) => `language:${l}`).join(" ");
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "ai-task-manager-pro",
    Accept: "application/vnd.github+json",
  };
  const res = await axios.get(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      `${label} ${langQuery}`
    )}&sort=stars`,
    { headers }
  );
  return res.data.items.slice(0, 10);
}
module.exports = { recommendRepos };