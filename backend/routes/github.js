const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { getProfile, getRepos } = require('../services/githubService');
const { calculateScore } = require('../services/scoringService');
const { recommendPersonalRepos, recommendDomainRepos } = require('../services/recommendationService');
const { getMentorAdvice } = require('../services/aiMentorService');

// --- ANALYZE ROUTE (Standard) ---
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;     
    const { domain } = req.query; 

    if (!username) return res.status(400).json({ error: "Username required" });

    const profile = await getProfile(username);
    const repos = await getRepos(username);
    const scoreResult = calculateScore(profile, repos);
    
    const languages = (scoreResult.languages && scoreResult.languages.length > 0) 
      ? scoreResult.languages 
      : ["JavaScript"];

    const [personalRecs, domainRecs] = await Promise.all([
      recommendPersonalRepos(scoreResult.level, languages),
      recommendDomainRepos(scoreResult.level, domain)
    ]);

    const mentorAdvice = getMentorAdvice(scoreResult.level);

    res.json({
      success: true,
      username: profile.login || username,
      profile: {
        followers: profile.followers,
        public_repos: profile.public_repos,
        avatar_url: profile.avatar_url,
        bio: profile.bio
      },
      score: scoreResult.score,
      level: scoreResult.level,
      languages: languages,
      personalRecommendations: personalRecs, 
      domainRecommendations: domainRecs,
      mentorAdvice: mentorAdvice 
    });

  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "User not found on GitHub" });
    }
    res.status(500).json({ error: err.message });
  }
});

// --- 🧠 SMART CHAT ROUTE (Hybrid: AI + Smart Fallback) ---

// Helper: Generates an intelligent answer without an API Key
function generateSmartFallback(repo, question) {
    const q = question.toLowerCase();
    const lang = (repo.language || "code").toLowerCase();
    
    // 1. Installation Logic
    if (q.includes("install") || q.includes("setup") || q.includes("build") || q.includes("run")) {
        if (lang.includes("javascript") || lang.includes("typescript")) return `Since ${repo.name} is a ${repo.language} project, you usually run 'npm install' then 'npm start'. Check package.json for details.`;
        if (lang.includes("python")) return `For Python projects like ${repo.name}, look for a requirements.txt and run 'pip install -r requirements.txt'.`;
        if (lang.includes("java")) return `This is a Java project. You'll likely need Maven or Gradle to build it.`;
        if (lang.includes("go")) return `For Go projects, try running 'go run main.go' or 'go build'.`;
        return `I recommend checking the README.md file in the root of ${repo.name} for build instructions specific to ${repo.language}.`;
    }

    // 2. "What is this" Logic
    if (q.includes("what") || q.includes("summary") || q.includes("describe") || q.includes("explain")) {
        if (repo.description) return `Summary: "${repo.description}". It's primarily built with ${repo.language}.`;
        return `${repo.name} is a ${repo.language} repository. No specific description was provided by the author.`;
    }

    // 3. Popularity Logic
    if (q.includes("star") || q.includes("popular") || q.includes("famous")) {
        if (repo.stars > 1000) return `Yes! It's very popular with ${repo.stars} stars.`;
        return `It has ${repo.stars} stars. It's a growing project worth checking out.`;
    }

    // 4. Contribution Logic
    if (q.includes("contribute") || q.includes("help") || q.includes("issue")) {
        return `You can help! Go to the 'Issues' tab on GitHub for ${repo.name} and look for 'good first issue' labels.`;
    }

    // 5. Default Context-Aware Answer
    return `That's a good question about ${repo.name}. Since I can't read the code directly right now, I suggest checking the source files in the ${repo.language} folder.`;
}

router.post('/chat', async (req, res) => {
  const { repoContext, question } = req.body;

  // OPTION A: Try Real AI
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("No Key");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try the most stable model first
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 

    const prompt = `
      You are a coding assistant.
      Repo: ${repoContext.name} (${repoContext.language})
      Description: ${repoContext.description}
      Question: "${question}"
      Answer in 1-2 short sentences.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return res.json({ answer: text });

  } catch (error) {
    // OPTION B: Smart Fallback (If AI fails, use logic)
    console.log("⚠️ AI Failed (Using Smart Logic instead):", error.message);
    
    const smartAnswer = generateSmartFallback(repoContext, question);
    return res.json({ answer: smartAnswer });
  }
});

module.exports = router;