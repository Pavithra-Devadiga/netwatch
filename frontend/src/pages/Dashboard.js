import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Wifi, CheckCircle, Clock } from "lucide-react";
import NetworkMap from "../components/NetworkMap";
import DeviceCard from "../components/DeviceCard";

function fmt(iso) {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Dashboard({
  devices, allDevices, stats, lastScan, scanning,
  onScan, onSelect, filter, setFilter, localIp
}) {
  return (
    <motion.div
      className="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stats */}
      <div className="stats-grid">
        <motion.div className="stat-card" whileHover={{ y: -2 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <div className="stat-label"><Wifi size={11} style={{ display: "inline", marginRight: 5 }} />Total Devices</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">{localIp ? `On ${localIp.split(".").slice(0,3).join(".")}.x` : "Local network"}</div>
        </motion.div>

        <motion.div className="stat-card danger" whileHover={{ y: -2 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="stat-label"><AlertTriangle size={11} style={{ display: "inline", marginRight: 5 }} />Threats</div>
          <div className="stat-value">{stats.threats}</div>
          <div className="stat-sub">{stats.threats === 0 ? "Network clear" : "Immediate attention"}</div>
        </motion.div>

        <motion.div className="stat-card warning" whileHover={{ y: -2 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-label"><Shield size={11} style={{ display: "inline", marginRight: 5 }} />Warnings</div>
          <div className="stat-value">{stats.warnings}</div>
          <div className="stat-sub">Needs review</div>
        </motion.div>

        <motion.div className="stat-card safe" whileHover={{ y: -2 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="stat-label"><CheckCircle size={11} style={{ display: "inline", marginRight: 5 }} />Safe</div>
          <div className="stat-value">{stats.total - stats.threats - stats.warnings}</div>
          <div className="stat-sub">
            <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
            Last scan: {fmt(lastScan)}
          </div>
        </motion.div>
      </div>

      {/* Network Map */}
      {allDevices.length > 0 && (
        <motion.div
          className="network-map-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="network-map-header">
            <span className="section-title">Network Topology</span>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--safe)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--safe)", display: "inline-block" }} /> Safe
              </span>
              <span style={{ fontSize: 12, color: "var(--warning)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warning)", display: "inline-block" }} /> Warning
              </span>
              <span style={{ fontSize: 12, color: "var(--danger)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--danger)", display: "inline-block" }} /> Threat
              </span>
            </div>
          </div>
          <NetworkMap devices={allDevices} onSelect={onSelect} />
        </motion.div>
      )}

      {/* Device list */}
      <div className="section-header">
        <span className="section-title">Devices ({devices.length})</span>
        <div className="filter-tabs">
          {["all", "threats", "warnings", "safe"].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📡</div>
          <div className="empty-title">
            {scanning ? "Scanning your network..." : "No devices found"}
          </div>
          <div className="empty-desc">
            {scanning ? "This usually takes 10–20 seconds." : "Click 'Scan Network' to discover devices."}
          </div>
          {!scanning && (
            <button className="btn btn-primary" style={{ margin: "1.5rem auto 0", display: "flex" }} onClick={onScan}>
              Scan Now
            </button>
          )}
        </div>
      ) : (
        <div className="device-grid">
          {devices.map((device, i) => (
            <DeviceCard
              key={device.ip}
              device={device}
              index={i}
              onClick={onSelect}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}