import axios from "axios";

const API_BASE = "http://localhost:5000";

export const fetchGitHubData = async (username) => {
  if (!username) throw new Error("Username is required");

  const res = await axios.get(`${API_BASE}/api/github/${username}`);
  return res.data;
};
