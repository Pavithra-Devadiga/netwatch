import React from "react";
import { motion } from "framer-motion";
import { Shield, Sun, Moon, Scan, Wifi } from "lucide-react";

export default function Navbar({ theme, setTheme, onScan, scanning, localIp }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <Shield size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="brand-name">NetWatch</span>
        <span className="brand-badge">Live</span>
      </div>

      <div className="navbar-right">
        {localIp && (
          <div className="ip-badge">
            <Wifi size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
            {localIp}
          </div>
        )}

        <motion.button
          className="btn btn-primary"
          onClick={onScan}
          disabled={scanning}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            animate={scanning ? { rotate: 360 } : { rotate: 0 }}
            transition={scanning ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
          >
            <Scan size={14} />
          </motion.div>
          {scanning ? "Scanning..." : "Scan Network"}
        </motion.button>

        <button
          className="theme-toggle"
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark"
            ? <Sun size={16} />
            : <Moon size={16} />
          }
        </button>
      </div>
    </nav>
  );
}