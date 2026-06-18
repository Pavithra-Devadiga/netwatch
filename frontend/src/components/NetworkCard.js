import React from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, AlertTriangle, ChevronRight, Wifi } from "lucide-react";

const ENC_COLORS = {
  NONE: "bad", OPEN: "bad",
  WEP: "mid",
  WPA: "mid",
  WPA2: "ok", WPA3: "ok",
};

function SignalBars({ bars, level }) {
  const color = level === "danger" ? "var(--danger)" : level === "warning" ? "var(--warning)" : "var(--safe)";
  const heights = [5, 8, 11, 14, 17];
  return (
    <div className="sig-bars" style={{ color }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="sig-bar"
          style={{
            height: h,
            background: i < bars ? color : "var(--border2)",
            borderRadius: 2,
            width: 4,
          }}
        />
      ))}
    </div>
  );
}

function encLabel(enc) {
  if (!enc || enc === "NONE" || enc === "OPEN") return "Open";
  return enc;
}

export default function NetworkCard({ network, index, onClick }) {
  const isOpen = !network.encryption || network.encryption === "NONE" || network.encryption === "OPEN";
  const encClass = ENC_COLORS[network.encryption] || "ok";

  return (
    <motion.div
      className={`net-card ${network.threat_level}`}
      onClick={() => onClick(network)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      layout
    >
      {/* Top row */}
      <div className="net-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
            {network.evil_twin && <span title="Evil Twin">👹</span>}
            {network.in_use && <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", background: "var(--accent-glow)", border: "1px solid rgba(124,58,237,.3)", padding: "1px 7px", borderRadius: 20 }}>CONNECTED</span>}
          </div>
          <div className="ssid" title={network.ssid}>{network.ssid}</div>
          <div className="bssid">{network.bssid}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          <span className={`badge ${network.threat_level}`}>
            {network.threat_level === "danger" ? "⚠ Threat" :
             network.threat_level === "warning" ? "⚡ Warning" : "✓ Safe"}
          </span>
          <SignalBars bars={network.signal_bars || 3} level={network.threat_level} />
        </div>
      </div>

      {/* Pills row */}
      <div className="net-row">
        <div className={`net-pill ${encClass}`}>
          {isOpen ? <Unlock size={11} /> : <Lock size={11} />}
          {encLabel(network.encryption)}
        </div>
        <div className="net-pill">
          <Wifi size={11} />
          {network.band || "2.4 GHz"}
        </div>
        <div className="net-pill">
          {network.signal_dbm || "—"} dBm
        </div>
      </div>

      {/* Threat reason */}
      {network.threat_reasons && network.threat_reasons.length > 0 && (
        <div className={`threat-box ${network.threat_level}`}>
          {network.threat_reasons[0]}
        </div>
      )}

      {/* Click hint */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <span style={{ fontSize: 11, color: "var(--t3)", display: "flex", alignItems: "center", gap: 3 }}>
          View details <ChevronRight size={12} />
        </span>
      </div>
    </motion.div>
  );
}