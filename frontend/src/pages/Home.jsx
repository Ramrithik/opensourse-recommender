import React, { useState } from "react";
import { fetchGitHubData } from "../services/api";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "3rem 1.5rem",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#f9fafb",
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  headerBlock: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    padding: "0.3rem 0.7rem",
    borderRadius: "999px",
    background: "rgba(59,130,246,0.15)",
    color: "#93c5fd",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 700,
    margin: 0,
    color: "#f9fafb",
  },
  subtitle: {
    marginTop: "0.8rem",
    fontSize: "1rem",
    color: "#cbd5e1",
    maxWidth: "36rem",
    margin: "0.8rem auto 0",
  },
  formRow: {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
    marginTop: "2rem",
    maxWidth: "40rem",
    marginInline: "auto",
  },
  inputWrapper: {
    flex: 1,
    borderRadius: "999px",
    border: "1px solid rgba(148,163,184,0.4)",
    backgroundColor: "rgba(15,23,42,0.85)",
    padding: "0.15rem 0.4rem",
  },
  input: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    padding: "0.7rem 0.9rem",
    color: "#f9fafb",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: (disabled) => ({
    padding: "0.7rem 1.4rem",
    borderRadius: "999px",
    border: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled
      ? "linear-gradient(135deg, #475569, #334155)"
      : "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "#f9fafb",
    boxShadow: disabled ? "none" : "0 6px 18px rgba(30,64,175,0.5)",
    transition: "all 0.25s ease",
  }),
  buttonHover: {
    transform: "translateY(-2px)",
    filter: "brightness(1.1)",
  },
  helperText: {
    marginTop: "0.6rem",
    fontSize: "0.8rem",
    color: "#94a3b8",
  },
  error: {
    marginTop: "1rem",
    color: "#fecaca",
    fontSize: "0.9rem",
    background: "rgba(185,28,28,0.1)",
    borderRadius: "0.6rem",
    padding: "0.6rem 0.8rem",
    border: "1px solid rgba(248,113,113,0.4)",
    maxWidth: "40rem",
    marginInline: "auto",
  },
  loadingText: {
    marginTop: "0.8rem",
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },
  resultSection: {
    marginTop: "3rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
  },
  card: {
    padding: "1.5rem",
    borderRadius: "1rem",
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(148,163,184,0.2)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  username: {
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#f3f4f6",
    margin: 0,
  },
  label: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginTop: "0.5rem",
    marginBottom: "0.1rem",
  },
  value: {
    fontSize: "0.95rem",
    color: "#e5e7eb",
    margin: 0,
  },
  repoList: {
    listStyle: "none",
    padding: 0,
    margin: "0.5rem 0 0",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  repoItem: {
    padding: "0.7rem",
    borderRadius: "0.7rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(30,41,59,0.6)",
    transition: "background 0.2s ease",
  },
  repoItemHover: {
    background: "rgba(59,130,246,0.25)",
  },
  repoLink: {
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  repoStars: {
    fontSize: "0.8rem",
    color: "#f9fafb",
    flexShrink: 0,
  },
  starIcon: {
    marginRight: "0.2rem",
  },
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [hoveredRepoId, setHoveredRepoId] = useState(null);

  const analyze = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }
    setError("");
    setData(null);
    setLoading(true);
    try {
      const res = await fetchGitHubData(username.trim());
      setData(res);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !username.trim();
  const buttonStyle = {
    ...styles.button(disabled),
    ...(buttonHovered && !disabled ? styles.buttonHover : {}),
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerBlock}>
          <div style={styles.badge}>GitHub Utility</div>
          <h1 style={styles.title}>GitHub Profile Analyzer</h1>
          <p style={styles.subtitle}>
            Evaluate GitHub activity, language focus, and curated repository recommendations.
          </p>

          <div style={styles.formRow}>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter GitHub username (e.g. gaearon)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                aria-label="GitHub username"
              />
            </div>
            <button
              type="button"
              onClick={analyze}
              style={buttonStyle}
              disabled={disabled}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              aria-label="Analyze GitHub profile"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {loading && !data && !error && (
            <p style={styles.loadingText}>Fetching profile and repositories…</p>
          )}

          {error && <p style={styles.error}>{error}</p>}
        </div>

        {data && (
          <div
            style={{
              ...styles.resultSection,
              gridTemplateColumns:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "1fr"
                  : styles.resultSection.gridTemplateColumns,
            }}
          >
            <section style={styles.card}>
              <h2 style={styles.username}>{data.username}</h2>

              <p style={styles.label}>Score</p>
              <p style={styles.value}>{data.score}</p>

              <p style={styles.label}>Level</p>
              <p style={styles.value}>{data.level}</p>

              <p style={styles.label}>Languages</p>
              <p style={styles.value}>{data.languages.join(", ")}</p>
            </section>

            <section style={styles.card}>
              <h3 style={styles.username}>&nbsp;Recommended repositories</h3>
              <ul style={styles.repoList}>
                {data.recommendations.map((repo) => (
                  <li
                    key={repo.id}
                    style={{
                      ...styles.repoItem,
                      ...(hoveredRepoId === repo.id ? styles.repoItemHover : {}),
                    }}
                    onMouseEnter={() => setHoveredRepoId(repo.id)}
                    onMouseLeave={() => setHoveredRepoId(null)}
                  >
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.repoLink}
                      title={repo.full_name}
                    >
                      {repo.full_name}
                    </a>
                    <span style={styles.repoStars}>
                      <span style={styles.starIcon}>★</span>
                      {repo.stargazers_count}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
