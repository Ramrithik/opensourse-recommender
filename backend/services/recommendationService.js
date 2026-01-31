const axios = require("axios");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchFromGitHub(query) {
  try {
    const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "Git-Analyzer-App",
    };
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=4`;
    const response = await axios.get(url, { headers });

    return response.data.items.map(repo => ({
      id: repo.id,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      language: repo.language
    }));
  } catch (error) {
    console.error("GitHub Search Error:", error.message);
    return [];
  }
}

async function recommendPersonalRepos(level, languages = []) {
    const primaryLang = languages[0] || "javascript";
    let query = "";
    if (level === "Beginner") query = `language:${primaryLang} topic:good-first-issue stars:50..5000`;
    else if (level === "Intermediate") query = `language:${primaryLang} stars:5000..20000`;
    else query = `language:${primaryLang} stars:>20000`;
    return await fetchFromGitHub(query);
}

async function recommendDomainRepos(level, domain = "web") {
    const domainMap = {
        ai: "topic:artificial-intelligence topic:machine-learning",
        cyber: "topic:cybersecurity topic:infosec",
        web: "topic:web-development topic:react",
        app: "topic:mobile topic:flutter",
        others: "topic:open-source"
    };
    const keywords = domainMap[domain] || domainMap["others"];
    const query = `${keywords} stars:>1000`;
    return await fetchFromGitHub(query);
}

module.exports = { recommendPersonalRepos, recommendDomainRepos };