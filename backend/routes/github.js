const express = require("express");
const { fetchGitHubProfile } = require("../services/githubService");
const { calculateScore } = require("../services/scoringService");
const { recommendRepos } = require("../services/recommendationService");

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Received request for username:", username);

    const { profile, repos } = await fetchGitHubProfile(username);
    console.log("Fetched profile and repos:", {
      login: profile.login,
      repoCount: repos.length,
    });

    const scoreData = calculateScore(profile, repos);
    const languages = [
      ...new Set(repos.map((r) => r.language).filter(Boolean)),
    ];
    const recommendations = await recommendRepos(
      scoreData.level,
      languages
    );

    res.json({
      username,
      score: scoreData.score,
      level: scoreData.level,
      languages,
      recommendations,
    });
  } catch (err) {
    console.error(
      "ERROR in /api/github/:username:",
      err.response?.data || err.message || err
    );
    res
      .status(500)
      .json({ error: "Unable to analyze GitHub profile" });
  }
});

module.exports = router;
