import axios from "axios";

const API_BASE = "https://opensourse-recommender.onrender.com";

export const fetchGitHubData = async (username, domain) => {
  if (!username) throw new Error("Username is required");
  const res = await axios.get(`${API_BASE}/api/github/${username}`, {
    params: { domain: domain }
  });
  return res.data;
};