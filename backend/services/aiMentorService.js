function getMentorAdvice(level) {
  if (level === "Beginner") {
    return [
      "Start contributing to documentation",
      "Pick issues with 'good first issue'",
      "Focus on reading code before writing"
    ];
  }

  if (level === "Intermediate") {
    return [
      "Fix medium-level bugs",
      "Improve test coverage",
      "Start reviewing PRs"
    ];
  }

  return [
    "Design new features",
    "Mentor newcomers",
    "Maintain an open-source project"
  ];
}

module.exports = { getMentorAdvice };
