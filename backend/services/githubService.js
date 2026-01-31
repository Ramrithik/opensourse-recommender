const axios = require('axios');

const headers = process.env.GITHUB_TOKEN
  ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  : {};

async function getProfile(username) {
  const { data } = await axios.get(
    `https://api.github.com/users/${username}`,
    { headers }
  );
  return data;
}

async function getRepos(username) {
  const { data } = await axios.get(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    { headers }
  );
  return data.filter(repo => !repo.fork);
}

module.exports = { getProfile, getRepos };
