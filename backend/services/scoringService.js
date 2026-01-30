function calculateScore(profile, repos) {
  let score = 0;

  score += Math.min(profile.followers * 2, 50);
  score += Math.min(profile.public_repos * 3, 60);

  repos.forEach((repo) => {
    score += repo.stargazers_count * 1.5;
    score += repo.forks_count * 2;
  });

  const languages = new Set();
  repos.forEach((repo) => repo.language && languages.add(repo.language));
  score += languages.size * 10;

  score = Math.min(score, 300);

  let level = "Beginner";
  if (score > 120) level = "Intermediate";
  if (score > 220) level = "Advanced";

  return { score, level };
}

module.exports = { calculateScore };
