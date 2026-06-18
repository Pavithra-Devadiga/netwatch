import React from "react";
import { motion } from "framer-motion";
import { Shield, Sun, Moon, Wifi, Radio } from "lucide-react";

export default function Navbar({ theme, setTheme, onScan, scanning, backendOnline }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <div className="nav-icon">
          <Shield size={17} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="nav-name">NetWatch</span>
        <span className="nav-tag">WiFi Intel</span>
      </div>

      <div className="nav-right">
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: backendOnline ? "var(--safe)" : "var(--danger)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: backendOnline ? "var(--safe)" : "var(--danger)", display: "inline-block" }} />
          {backendOnline ? "Backend Live" : "Backend Offline"}
        </div>

        <motion.button
          className="btn btn-primary"
          onClick={onScan}
          disabled={scanning}
          whileTap={{ scale: 0.96 }}
        >
          <motion.div
            animate={scanning ? { rotate: 360 } : { rotate: 0 }}
            transition={scanning ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
          >
            <Radio size={14} />
          </motion.div>
          {scanning ? "Scanning..." : "Scan WiFi"}
        </motion.button>

        <button
          className="icon-btn"
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </nav>
  );
}