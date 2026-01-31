function calculateScore(profile, repos) {
  let score = 0;

  // 1. Basic Metrics
  score += Math.min(profile.followers * 2, 50); 
  score += Math.min(profile.public_repos * 3, 60);

  repos.forEach((repo) => {
    score += repo.stargazers_count * 1.5;
    score += repo.forks_count * 2;
  });

  // 2. Skill Detection
  const skillSet = new Set();

  repos.forEach((repo) => {
    if (repo.language) skillSet.add(repo.language);
    
    // Scan topics for frameworks
    if (repo.topics && Array.isArray(repo.topics)) {
      const frameworks = ["react", "vue", "angular", "node", "django", "flask", "spring", "docker", "kubernetes", "aws", "firebase", "flutter", "swiftui"];
      repo.topics.forEach((t) => {
        if (frameworks.includes(t.toLowerCase())) {
            skillSet.add(t.charAt(0).toUpperCase() + t.slice(1));
        }
      });
    }
  });

  // Scan Bio
  if (profile.bio) {
    const keywords = ["java", "python", "javascript", "c++", "c#", "go", "rust"];
    const bio = profile.bio.toLowerCase();
    keywords.forEach(k => {
        if (bio.includes(k)) skillSet.add(k.charAt(0).toUpperCase() + k.slice(1));
    });
  }

  score += skillSet.size * 5;
  score = Math.min(score, 300); 

  let level = "Beginner";
  if (score > 100) level = "Intermediate";
  if (score > 200) level = "Expert";

  return { 
      score: Math.round(score), 
      level, 
      languages: Array.from(skillSet).slice(0, 15) // Top 15 skills
  };
}

module.exports = { calculateScore };