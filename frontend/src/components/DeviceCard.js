import React from "react";
import { motion } from "framer-motion";

const RISKY_PORTS = new Set([22, 23, 3306, 5900, 1433, 4444, 8080]);

const VENDOR_ICONS = {
  Apple: "🍎", Samsung: "📱", Cisco: "🌐", Intel: "💻",
  "Raspberry Pi": "🔴", Google: "🔵", Amazon: "📦", Unknown: "❓"
};

function formatBytes(b) {
  if (!b) return "0 B";
  if (b > 1e6) return (b / 1e6).toFixed(1) + " MB";
  if (b > 1e3) return (b / 1e3).toFixed(1) + " KB";
  return b + " B";
}

export default function DeviceCard({ device, index, onClick }) {
  const icon = device.is_gateway ? "🌐" : (VENDOR_ICONS[device.vendor] || "💻");
  const name = device.hostname || device.vendor || "Unknown Device";

  return (
    <motion.div
      className={`device-card ${device.threat_level}`}
      onClick={() => onClick(device)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="device-header">
        <div className={`device-icon ${device.is_gateway ? "gateway" : device.threat_level}`}>
          <span style={{ fontSize: 20 }}>{icon}</span>
        </div>
        <span className={`threat-badge ${device.threat_level}`}>
          {device.threat_level === "danger" ? "⚠ Threat" :
           device.threat_level === "warning" ? "⚡ Warning" : "✓ Safe"}
        </span>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="device-name" title={name}>{name}</div>
        <div className="device-ip">{device.ip}</div>
      </div>

      {device.threat_reason && (
        <div style={{
          marginTop: 10,
          padding: "6px 10px",
          background: device.threat_level === "danger" ? "var(--danger-bg)" : "var(--warning-bg)",
          borderRadius: 8,
          fontSize: 11,
          color: device.threat_level === "danger" ? "var(--danger)" : "var(--warning)",
        }}>
          {device.threat_reason}
        </div>
      )}

      {device.open_ports && device.open_ports.length > 0 && (
        <div className="ports-row">
          {device.open_ports.slice(0, 6).map(port => (
            <span key={port} className={`port-tag ${RISKY_PORTS.has(port) ? "risky" : ""}`}>
              :{port}
            </span>
          ))}
          {device.open_ports.length > 6 && (
            <span className="port-tag">+{device.open_ports.length - 6}</span>
          )}
        </div>
      )}

      <div className="device-meta">
        <div className="device-meta-item">
          <span className="pulse-dot online" />
          Online
        </div>
        {device.vendor && device.vendor !== "Unknown" && (
          <div className="device-meta-item">
            {device.vendor}
          </div>
        )}
        <div className="device-meta-item" style={{ marginLeft: "auto" }}>
          ↑ {formatBytes(device.bytes_sent)}
        </div>
      </div>
    </motion.div>
  );
}