import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Unlock, AlertTriangle, ShieldCheck, Wifi, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ENC_INFO = {
  NONE:  { label: "No Encryption (Open)", color: "danger", tip: "All data sent over this network is visible to anyone nearby. Never use this for banking, logins, or sensitive tasks." },
  OPEN:  { label: "No Encryption (Open)", color: "danger", tip: "All data sent over this network is visible to anyone nearby. Never use this for banking, logins, or sensitive tasks." },
  WEP:   { label: "WEP (Broken)", color: "danger", tip: "WEP was cracked in 2001. An attacker can break WEP encryption in under 60 seconds using freely available tools." },
  WPA:   { label: "WPA (Weak)", color: "warning", tip: "Original WPA has known vulnerabilities. It can be cracked with dictionary attacks. Upgrade to WPA2 or WPA3." },
  WPA2:  { label: "WPA2 (Good)", color: "safe", tip: "WPA2 is the current standard and generally secure. Use a strong, unique password and ensure PMKID/KRACK patches are applied." },
  WPA3:  { label: "WPA3 (Best)", color: "safe", tip: "WPA3 is the latest and most secure WiFi encryption standard. Excellent choice." },
};

const SAFETY_TIPS = {
  danger: [
    "🚫 Do NOT connect to this network",
    "🔐 Use mobile data instead if available",
    "📵 If you must connect, use a VPN",
    "🛡️ Disable auto-connect for this SSID",
    "⚠️ Report to your network admin if on premises",
  ],
  warning: [
    "⚠️ Connect with caution — use a VPN",
    "🚫 Avoid banking or sensitive logins",
    "🔒 Ensure HTTPS on all sites you visit",
    "📶 Prefer your mobile hotspot instead",
  ],
  safe: [
    "✅ Network appears safe to connect",
    "🔒 Always verify HTTPS when browsing",
    "🛡️ Using a VPN adds extra protection",
    "📶 Keep your device software updated",
  ],
};

function genChart() {
  return Array.from({ length: 14 }, (_, i) => {
    const t = new Date(Date.now() - (13 - i) * 4000);
    return {
      t: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      signal: Math.floor(Math.random() * 20 + 60),
    };
  });
}

function ScoreBar({ score, level }) {
  const color = level === "danger" ? "var(--danger)" : level === "warning" ? "var(--warning)" : "var(--safe)";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: "var(--t2)" }}>Threat Score</span>
        <span style={{ fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div className="score-bar-bg">
        <motion.div
          className="score-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

export default function DetailPage({ network, onBack }) {
  const [chart, setChart] = useState(genChart);
  const enc = ENC_INFO[network.encryption] || ENC_INFO.WPA2;
  const tips = SAFETY_TIPS[network.threat_level] || SAFETY_TIPS.safe;
  const isOpen = !network.encryption || network.encryption === "NONE" || network.encryption === "OPEN";

  useEffect(() => {
    const iv = setInterval(() => {
      setChart(prev => {
        const t = new Date();
        return [...prev.slice(1), {
          t: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          signal: Math.floor(Math.random() * 20 + 60),
        }];
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 10, padding: "8px 12px", fontSize: 12 }}>
        <div style={{ color: "var(--t2)", marginBottom: 4 }}>{label}</div>
        <div style={{ color: "var(--accent)" }}>Signal: {payload[0]?.value}%</div>
      </div>
    );
  };

  return (
    <motion.div
      className="detail"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.25 }}
    >
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: "1.5rem" }}>
        <ArrowLeft size={14} /> Back to dashboard
      </button>

      {/* Hero card */}
      <div className="detail-hero">
        <div className={`detail-icon-wrap ${network.threat_level}`}>
          {isOpen ? <Unlock size={28} color="var(--danger)" /> : <Lock size={28} color={network.threat_level === "safe" ? "var(--safe)" : "var(--warning)"} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <div className="detail-ssid">{network.ssid}</div>
            <span className={`badge ${network.threat_level}`}>
              {network.threat_level === "danger" ? "⚠ High Risk" : network.threat_level === "warning" ? "⚡ Warning" : "✓ Safe"}
            </span>
            {network.evil_twin && <span className="badge danger">👹 Evil Twin</span>}
            {network.in_use && <span className="badge" style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid rgba(124,58,237,.3)" }}>● Connected</span>}
          </div>
          <div className="detail-bssid">{network.bssid}</div>
          <div style={{ marginTop: 14 }}>
            <ScoreBar score={network.threat_score || 0} level={network.threat_level} />
          </div>
        </div>
      </div>

      {/* Evil twin banner */}
      {network.evil_twin && (
        <div className="evil-alert">
          <div className="evil-alert-icon">👹</div>
          <div>
            <div className="evil-alert-title">EVIL TWIN ATTACK — This network is a duplicate!</div>
            <div className="evil-alert-desc">
              Another network with the same SSID <strong>"{network.ssid}"</strong> was detected. This is a classic man-in-the-middle attack.
              A hacker places a fake access point with the same name to intercept your passwords, bank details, and messages.
              <strong style={{ color: "var(--danger)" }}> Do NOT connect.</strong>
            </div>
          </div>
        </div>
      )}

      {/* Info grid */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-title">Network Details</div>
          <div className="info-row"><span className="info-k">SSID</span><span className="info-v">{network.ssid}</span></div>
          <div className="info-row"><span className="info-k">BSSID / MAC</span><span className="info-v">{network.bssid || "Unknown"}</span></div>
          <div className="info-row"><span className="info-k">Frequency Band</span><span className="info-v">{network.band || "2.4 GHz"}</span></div>
          <div className="info-row"><span className="info-k">Signal Strength</span><span className="info-v">{network.signal_dbm} dBm</span></div>
          <div className="info-row"><span className="info-k">Signal Quality</span><span className="info-v">{network.signal || 0}%</span></div>
          <div className="info-row"><span className="info-k">Status</span><span className="info-v" style={{ color: network.in_use ? "var(--safe)" : "var(--t2)" }}>{network.in_use ? "● Connected" : "○ Not Connected"}</span></div>
        </div>

        <div className="info-card">
          <div className="info-card-title">Security Analysis</div>
          <div className="info-row">
            <span className="info-k">Encryption</span>
            <span className="info-v" style={{ color: enc.color === "danger" ? "var(--danger)" : enc.color === "warning" ? "var(--warning)" : "var(--safe)" }}>
              {enc.label}
            </span>
          </div>
          <div className="info-row"><span className="info-k">Threat Level</span><span className={`badge ${network.threat_level}`} style={{ fontSize: 11 }}>{network.threat_level.toUpperCase()}</span></div>
          <div className="info-row"><span className="info-k">Evil Twin</span><span className="info-v" style={{ color: network.evil_twin ? "var(--danger)" : "var(--safe)" }}>{network.evil_twin ? "⚠ Detected" : "✓ Not Detected"}</span></div>
          <div className="info-row"><span className="info-k">Risk Score</span><span className="info-v" style={{ color: network.threat_level === "danger" ? "var(--danger)" : network.threat_level === "warning" ? "var(--warning)" : "var(--safe)" }}>{network.threat_score || 0} / 100</span></div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--bg2)", borderRadius: 10, fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}>
            <Info size={11} style={{ display: "inline", marginRight: 5 }} />
            {enc.tip}
          </div>
        </div>
      </div>

      {/* Threat reasons */}
      {network.threat_reasons && network.threat_reasons.length > 0 && (
        <div className="threats-card">
          <div className="info-card-title" style={{ marginBottom: "1rem" }}>
            <AlertTriangle size={13} style={{ display: "inline", marginRight: 6, color: "var(--danger)" }} />
            Threat Reasons ({network.threat_reasons.length})
          </div>
          {network.threat_reasons.map((r, i) => (
            <div key={i} className="threat-item">
              <div className={`threat-dot ${network.threat_level}`} />
              <span style={{ color: "var(--t1)" }}>{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Live signal chart */}
      <div className="info-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="info-card-title" style={{ margin: 0 }}>Live Signal Strength</div>
          <div className="live"><span className="live-dot" />Live</div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chart}>
            <defs>
              <linearGradient id="sigGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: "var(--t2)" }} interval={3} />
            <YAxis tick={{ fontSize: 9, fill: "var(--t2)" }} domain={[0, 100]} unit="%" width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="signal" stroke="var(--accent)" strokeWidth={2} fill="url(#sigGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Safety tips */}
      <div className="info-card">
        <div className="info-card-title" style={{ marginBottom: "1rem" }}>
          <ShieldCheck size={13} style={{ display: "inline", marginRight: 6, color: "var(--safe)" }} />
          Safety Recommendations
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                padding: "10px 14px",
                background: "var(--bg2)",
                borderRadius: 10,
                fontSize: 13,
                color: "var(--t1)",
                border: "1px solid var(--border)",
                lineHeight: 1.5,
              }}
            >
              {tip}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}