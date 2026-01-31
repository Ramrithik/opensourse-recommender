import React, { useState } from "react";
import { fetchGitHubData } from "../services/api";
import ChatBot from "../ChatBot";

const styles = {
  page: { minHeight: "100vh", fontFamily: "'Poppins', sans-serif", color: "#1D2026", background: "#FFFFFF", overflowX: "hidden" },
  header: { background: "#FFFFFF", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #F3F4F6" },
  logo: { fontSize: "1.5rem", fontWeight: 800, color: "#1D2026", letterSpacing: "-0.5px" },
  logoOrange: { color: "#FF9500" },
  heroSection: { padding: "5rem 2rem 6rem", background: "linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%)", display: "flex", alignItems: "center", justifyContent: "center" },
  heroContainer: { maxWidth: "1200px", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "4rem", alignItems: "center" },
  heroTitle: { fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", color: "#1D2026" },
  heroTitleOrange: { color: "#FF9500" },
  heroSubtitle: { fontSize: "1.1rem", color: "#6C727F", lineHeight: 1.6, marginBottom: "2.5rem", maxWidth: "550px" },
  searchContainer: { display: "flex", alignItems: "center", background: "#FFFFFF", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", padding: "0.5rem", maxWidth: "600px", border: "1px solid #E5E7EB" },
  input: { flex: 1, border: "none", padding: "1rem 1.2rem", fontSize: "1rem", outline: "none", color: "#1D2026", minWidth: "150px" },
  divider: { width: "1px", height: "24px", background: "#E5E7EB", margin: "0 0.5rem" },
  select: { border: "none", padding: "0 1rem", fontSize: "0.95rem", outline: "none", color: "#4B5563", background: "transparent", cursor: "pointer", fontWeight: 500, minWidth: "110px" },
  analyzeBtn: (disabled) => ({ background: disabled ? "#E5E7EB" : "#FF9500", color: disabled ? "#9CA3AF" : "#FFFFFF", border: "none", borderRadius: "8px", padding: "0.9rem 2rem", fontWeight: 600, fontSize: "1rem", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap" }),
  
  heroRight: { position: "relative", display: "flex", justifyContent: "center", animation: "fadeInRight 0.8s ease-out" },
  dashboardVisual: { width: "100%", maxWidth: "450px", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB", overflow: "hidden" },
  dashboardHeader: { background: "#F9FAFB", padding: "1rem", borderBottom: "1px solid #E5E7EB", display: "flex", gap: "0.5rem" },
  dot: { width: "10px", height: "10px", borderRadius: "50%" },
  dashboardContent: { padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" },
  skeletonRow: { display: "flex", gap: "1rem", alignItems: "center" },
  skeletonBox: { flex: 1, height: "80px", background: "#FFF9F0", borderRadius: "8px", border: "1px solid #FFE5CC" },
  skeletonBarGraph: { display: "flex", gap: "6px", alignItems: "flex-end", height: "60px", marginTop: "1rem" },
  bar: (h) => ({ width: "12px", background: "#FF9500", borderRadius: "4px", height: h, opacity: 0.8 }),

  resultsSection: { padding: "4rem 2rem", background: "#FFFFFF", borderTop: "1px solid #F3F4F6" },
  resultsContainer: { maxWidth: "1200px", margin: "0 auto" },
  sectionHeader: { textAlign: "center", marginBottom: "3rem" },
  sectionTitle: { fontSize: "2.2rem", fontWeight: 700, color: "#1D2026", marginBottom: "0.5rem" },
  levelBadge: { display: "inline-block", background: "#FF9500", color: "#fff", padding: "0.4rem 1.2rem", borderRadius: "6px", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.5rem" },
  
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "2rem", alignItems: "stretch" },
  card: { background: "#FFFFFF", borderRadius: "12px", padding: "2rem", border: "2px solid #111827", boxShadow: "4px 4px 0px #111827", display: "flex", flexDirection: "column", height: "100%" },
  cardHeader: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "2px solid #F3F4F6" },
  cardIcon: { width: "48px", height: "48px", borderRadius: "10px", background: "#FF9500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#fff" },
  cardTitle: { fontSize: "1.25rem", fontWeight: 700, color: "#1D2026" },
  
  profileAvatar: { width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #111827", marginBottom: "1rem" },
  statRow: { display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px dashed #E5E7EB" },
  statLabel: { color: "#6B7280", fontWeight: 600, fontSize: "0.9rem" },
  statValue: { fontWeight: 700, color: "#111827", fontSize: "1.1rem" },
  tagContainer: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" },
  tag: { background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 },
  
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" },
  listItem: { background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "transform 0.2s" },
  listLink: { textDecoration: "none", color: "#1D2026", fontWeight: 600, flex: 1 },
  askAiBtn: { background: "#111827", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", marginLeft: "1rem" },
  
  adviceItem: { background: "#FAFAFA", borderLeft: "4px solid #FF9500", borderRadius: "4px", padding: "1rem", display: "flex", alignItems: "flex-start", gap: "0.8rem", marginBottom: "0.8rem" },
  
  error: { marginTop: "1rem", color: "#DC2626", fontWeight: 500 },
  footer: { textAlign: "center", padding: "3rem", color: "#9CA3AF", background: "#FFFFFF" }
};

const keyframesStyle = `@keyframes fadeInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } } @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } } @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`;

export default function Home() {
  const [username, setUsername] = useState("");
  const [domain, setDomain] = useState("web");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChatRepo, setActiveChatRepo] = useState(null);

  const analyze = async () => {
    if (!username.trim()) { setError("Please enter a username"); return; }
    setError(""); setData(null); setLoading(true);
    try {
      const res = await fetchGitHubData(username.trim(), domain);
      setData(res);
    } catch (err) { setError("User not found or API error."); } finally { setLoading(false); }
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={styles.page}>
        <header style={styles.header}><div style={styles.logo}><span style={styles.logoOrange}>Git</span>Analyzer</div></header>

        <section style={styles.heroSection}>
          <div style={styles.heroContainer}>
            <div style={{animation: "fadeInLeft 0.8s ease-out"}}>
              <h1 style={styles.heroTitle}>Analyzing GitHub Profiles <br /><span style={styles.heroTitleOrange}>Is Now Much Easier</span></h1>
              <p style={styles.heroSubtitle}>Discover comprehensive insights into developer activity, language expertise, and get personalized repository recommendations.</p>
              <div style={styles.searchContainer}>
                <input style={styles.input} placeholder="Enter GitHub username..." value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => e.key === "Enter" && !loading && analyze()} />
                <div style={styles.divider}></div>
                <select style={styles.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
                  <option value="web">Web Dev</option><option value="app">App Dev</option><option value="ai">AI / ML</option><option value="cyber">Cyber Sec</option>
                </select>
                <button onClick={analyze} disabled={loading || !username.trim()} style={styles.analyzeBtn(loading || !username.trim())}>{loading ? "..." : "Analyze"}</button>
              </div>
              {error && <div style={styles.error}><span>⚠️</span> {error}</div>}
            </div>

            <div style={styles.heroRight}>
              <div style={styles.dashboardVisual}>
                <div style={styles.dashboardHeader}><div style={{...styles.dot, background: "#EF4444"}}></div><div style={{...styles.dot, background: "#F59E0B"}}></div><div style={{...styles.dot, background: "#10B981"}}></div></div>
                <div style={styles.dashboardContent}>
                    <div style={styles.skeletonRow}><div style={styles.skeletonBox}></div><div style={styles.skeletonBox}></div></div>
                    <div style={{...styles.skeletonBox, height: "120px", background: "#FAFAFA", border: "1px dashed #E5E7EB"}}>
                         <div style={{padding: "1rem"}}>
                            <div style={{fontSize: "0.8rem", color: "#9CA3AF", marginBottom: "0.5rem"}}>Activity Graph</div>
                            <div style={styles.skeletonBarGraph}>
                                <div style={styles.bar("40%")}></div><div style={styles.bar("70%")}></div><div style={styles.bar("50%")}></div><div style={styles.bar("90%")}></div><div style={styles.bar("30%")}></div><div style={styles.bar("60%")}></div><div style={styles.bar("80%")}></div>
                            </div>
                         </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {data && (
          <section style={styles.resultsSection}>
            <div style={styles.resultsContainer}>
              <div style={styles.sectionHeader}><h2 style={styles.sectionTitle}>Results for {data.username}</h2><div style={styles.levelBadge}>{data.level} Developer • Score: {data.score}</div></div>
              <div style={styles.cardsGrid}>
                
                {/* 1. PROFILE */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}><div style={styles.cardIcon}>👤</div><h3 style={styles.cardTitle}>Profile Insights</h3></div>
                  {data.profile.avatar_url && <img src={data.profile.avatar_url} style={styles.profileAvatar} alt="profile" />}
                  <div style={styles.statRow}><span style={styles.statLabel}>FOLLOWERS</span><span style={styles.statValue}>{data.profile.followers}</span></div>
                  <div style={styles.statRow}><span style={styles.statLabel}>PUBLIC REPOS</span><span style={styles.statValue}>{data.profile.public_repos}</span></div>
                  <div style={styles.tagContainer}>{data.languages.map((lang, i) => <span key={i} style={styles.tag}>{lang}</span>)}</div>
                </div>

                {/* 2. TECH STACK */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}><div style={styles.cardIcon}>💻</div><h3 style={styles.cardTitle}>Tech Stack Picks</h3></div>
                  <ul style={styles.list}>
                    {data.personalRecommendations.map(repo => (
                      <li key={repo.id} style={styles.listItem}>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" style={styles.listLink}>{repo.full_name}</a>
                        <button style={styles.askAiBtn} onClick={() => setActiveChatRepo(repo)}>Ask AI</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. AI MENTOR */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}><div style={styles.cardIcon}>🤖</div><h3 style={styles.cardTitle}>AI Mentor Advice</h3></div>
                  <ul style={styles.list}>{data.mentorAdvice.map((tip, i) => (<li key={i} style={styles.adviceItem}><span style={{fontSize:"1.2rem"}}>💡</span><span style={{color: "#374151", fontSize: "0.95rem", lineHeight: "1.5"}}>{tip}</span></li>))}</ul>
                </div>

                {/* 4. DOMAIN PICKS */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}><div style={styles.cardIcon}>🌍</div><h3 style={styles.cardTitle}>Top {domain.toUpperCase()} Picks</h3></div>
                  <ul style={styles.list}>
                    {data.domainRecommendations.map(repo => (
                      <li key={repo.id} style={styles.listItem}>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" style={styles.listLink}>{repo.full_name}</a>
                        <button style={styles.askAiBtn} onClick={() => setActiveChatRepo(repo)}>Ask AI</button>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </section>
        )}
        <footer style={styles.footer}>Powered by <span style={{color: "#FF9500", fontWeight: 700}}>Git Analyzer</span></footer>
        {activeChatRepo && <ChatBot repo={activeChatRepo} onClose={() => setActiveChatRepo(null)} />}
      </div>
    </>
  );
}