import React from "react";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
        <Shield size={13} style={{ color: "var(--accent)" }} />
        <span style={{ fontWeight: 600, color: "var(--t2)" }}>NetWatch</span>
        <span>— WiFi Threat Intelligence Platform</span>
      </div>

      <div>
        Built for educational & cybersecurity research purposes · Never connect to unknown networks
      </div>

      {/* 👇 ADD YOUR NAME HERE */}
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
        Created by PAVITHRA D
      </div>
    </footer>
  );
}