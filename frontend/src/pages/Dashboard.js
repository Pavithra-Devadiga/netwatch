import React from "react";
import { motion } from "framer-motion";
import { Radio, AlertTriangle, ShieldAlert, ShieldCheck, Wifi, WifiOff, Clock, Zap } from "lucide-react";
import NetworkCard from "../components/NetworkCard";

function fmtTime(iso) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Dashboard({ networks, allNetworks, stats, lastScan, scanning, onScan, onSelect, filter, setFilter, backendOnline }) {

  const evilTwins = allNetworks.filter(n => n.evil_twin);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── HERO ── */}
      <div className="hero">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="hero-badge">
            <Radio size={12} />
            Real-Time WiFi Threat Intelligence
          </div>
          <h1 className="hero-title">
            Is Your WiFi<br /><span>Safe to Connect?</span>
          </h1>
          <p className="hero-sub">
            NetWatch scans nearby WiFi networks, analyzes encryption, detects rogue access points,
            evil twin attacks, and open honeypots — in real time.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button className="btn btn-primary" onClick={onScan} disabled={scanning} whileTap={{ scale: 0.96 }} style={{ padding: "11px 28px", fontSize: 14 }}>
              <motion.div animate={scanning ? { rotate: 360 } : {}} transition={scanning ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}>
                <Radio size={15} />
              </motion.div>
              {scanning ? "Scanning Networks..." : "Scan Nearby WiFi"}
            </motion.button>
            {lastScan && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--t2)", background: "var(--card)", border: "1px solid var(--border)", padding: "8px 16px", borderRadius: 10 }}>
                <Clock size={12} />
                Last scan: {fmtTime(lastScan)}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        {[
          { label: "Networks Found", value: stats.total, cls: "", icon: <Wifi size={12} />, hint: "In scan range" },
          { label: "Threats", value: stats.danger, cls: "red", icon: <ShieldAlert size={12} />, hint: stats.danger > 0 ? "Avoid these!" : "All clear" },
          { label: "Warnings", value: stats.warning, cls: "amber", icon: <AlertTriangle size={12} />, hint: "Review before connecting" },
          { label: "Evil Twins", value: stats.evil_twins, cls: stats.evil_twins > 0 ? "red" : "", icon: <Zap size={12} />, hint: stats.evil_twins > 0 ? "Fake networks detected!" : "None detected" },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <div className="stat-label">{s.icon}{s.label}</div>
            <div className={`stat-num ${s.cls}`}>{s.value}</div>
            <div className="stat-hint">{s.hint}</div>
          </motion.div>
        ))}
      </div>

      {/* ── MAIN ── */}
      <div className="main">

        {/* Backend offline notice */}
        {!backendOnline && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
            background: "var(--warning-bg)", border: "1px solid var(--warning-border)",
            borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 12, fontSize: 13,
          }}>
            <WifiOff size={18} color="var(--warning)" />
            <div>
              <strong style={{ color: "var(--warning)" }}>Backend not running.</strong>
              <span style={{ color: "var(--t2)", marginLeft: 8 }}>
                Open terminal → <code style={{ background: "var(--bg2)", padding: "1px 6px", borderRadius: 4 }}>cd backend && python app.py</code>
              </span>
            </div>
          </motion.div>
        )}

        {/* Evil twin global alert */}
        {evilTwins.length > 0 && (
          <motion.div className="evil-alert" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="evil-alert-icon">🚨</div>
            <div>
              <div className="evil-alert-title">EVIL TWIN ATTACK DETECTED — {evilTwins.length} Duplicate Network{evilTwins.length > 1 ? "s" : ""}</div>
              <div className="evil-alert-desc">
                Two or more networks share the same name. One is fake — designed to intercept your traffic, steal passwords, and spy on your browsing. <strong style={{ color: "var(--danger)" }}>Do NOT connect to any network named: {[...new Set(evilTwins.map(e => e.ssid))].join(", ")}</strong>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section header + filters */}
        <div className="sec-head">
          <div className="sec-title">
            <ShieldCheck size={16} style={{ color: "var(--accent)" }} />
            Nearby Networks <span>({networks.length})</span>
          </div>
          <div className="tabs">
            {[
              { k: "all", l: "All" },
              { k: "danger", l: "🔴 Threats" },
              { k: "warning", l: "⚡ Warnings" },
              { k: "safe", l: "✓ Safe" },
              { k: "open", l: "🔓 Open" },
            ].map(t => (
              <button key={t.k} className={`tab ${filter === t.k ? "on" : ""}`} onClick={() => setFilter(t.k)}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        {/* Network grid */}
        {networks.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📡</div>
            <div className="empty-t">{scanning ? "Scanning nearby networks..." : "No networks found"}</div>
            <div className="empty-s">
              {scanning
                ? "This usually takes 10–20 seconds. Using nmcli to scan..."
                : backendOnline
                  ? "Click 'Scan Nearby WiFi' to discover networks in your area."
                  : "Start the Python backend first, then scan."
              }
            </div>
            {!scanning && backendOnline && (
              <button className="btn btn-primary" onClick={onScan} style={{ margin: "0 auto" }}>
                <Radio size={14} /> Scan Now
              </button>
            )}
          </div>
        ) : (
          <motion.div className="net-grid" layout>
            {networks.map((net, i) => (
              <NetworkCard key={`${net.ssid}-${net.bssid}`} network={net} index={i} onClick={onSelect} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}