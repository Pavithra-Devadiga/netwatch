import React from "react";
import { motion } from "framer-motion";

export default function ScanOverlay() {
  return (
    <motion.div
      className="scan-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="scan-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="scan-rings">
          <div className="scan-ring" />
          <div className="scan-ring" />
          <div className="scan-ring" />
          <div className="scan-dot" />
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Scanning Network</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          Discovering devices on your local network...
        </div>
        <div style={{
          marginTop: 20,
          padding: "8px 16px",
          background: "var(--bg-secondary)",
          borderRadius: 8,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--accent)",
        }}>
          nmap -sn 192.168.x.x/24
        </div>
      </motion.div>
    </motion.div>
  );
}