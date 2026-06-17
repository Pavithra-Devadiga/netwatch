import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Shield, Wifi } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import axios from "axios";

const VENDOR_ICONS = {
  Apple: "🍎", Samsung: "📱", Cisco: "🌐", Intel: "💻",
  "Raspberry Pi": "🔴", Google: "🔵", Amazon: "📦", Unknown: "❓"
};

const PORT_NAMES = {
  21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
  80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 445: "SMB",
  3306: "MySQL", 3389: "RDP", 5900: "VNC", 8080: "HTTP-Alt", 8443: "HTTPS-Alt"
};

const RISKY_PORTS = new Set([22, 23, 3306, 5900, 1433, 4444, 8080, 445, 3389]);

function formatBytes(b) {
  if (!b) return "0 B";
  if (b > 1e6) return (b / 1e6).toFixed(2) + " MB";
  if (b > 1e3) return (b / 1e3).toFixed(2) + " KB";
  return b + " B";
}

function generateTrafficData() {
  return Array.from({ length: 12 }, (_, i) => {
    const t = new Date(Date.now() - (11 - i) * 5000);
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      sent: Math.floor(Math.random() * 200 + 20),
      recv: Math.floor(Math.random() * 600 + 50),
    };
  });
}

export default function DeviceDetail({ device, onBack }) {
  const [trafficData, setTrafficData] = useState(generateTrafficData);
  const [openPorts, setOpenPorts] = useState(device.open_ports || []);
  const [scanningPorts, setScanningPorts] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const t = new Date();
        return [...prev.slice(1), {
          time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          sent: Math.floor(Math.random() * 200 + 20),
          recv: Math.floor(Math.random() * 600 + 50),
        }];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scanPorts = async () => {
    setScanningPorts(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/device/${device.ip}/ports`);
      setOpenPorts(res.data.open_ports || []);
    } catch {}
    setScanningPorts(false);
  };

  const icon = device.is_gateway ? "🌐" : (VENDOR_ICONS[device.vendor] || "💻");
  const name = device.hostname || device.vendor || "Unknown Device";

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 14px", fontSize: 12
      }}>
        <div style={{ color: "var(--text-secondary)", marginBottom: 6 }}>{label}</div>
        <div style={{ color: "#6366f1", marginBottom: 3 }}>↑ Sent: {payload[0]?.value} KB</div>
        <div style={{ color: "#10b981" }}>↓ Recv: {payload[1]?.value} KB</div>
      </div>
    );
  };

  return (
    <motion.div
      className="detail-page"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back */}
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: "1.5rem" }}>
        <ArrowLeft size={14} />
        Back to dashboard
      </button>

      {/* Header */}
      <div className="detail-header">
        <div className={`detail-icon ${device.is_gateway ? "gateway" : device.threat_level}`}
          style={{
            background: device.threat_level === "danger" ? "var(--danger-bg)" :
                        device.threat_level === "warning" ? "var(--warning-bg)" :
                        device.is_gateway ? "var(--accent-glow)" : "var(--safe-bg)"
          }}>
          <span>{icon}</span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{name}</h1>
            <span className={`threat-badge ${device.threat_level}`}>
              {device.threat_level === "danger" ? "⚠ Threat Detected" :
               device.threat_level === "warning" ? "⚡ Warning" : "✓ Safe"}
            </span>
          </div>
          <div className="device-ip" style={{ marginTop: 4 }}>{device.ip}</div>
        </div>
      </div>

      {/* Alert banner */}
      {device.threat_level !== "safe" && device.threat_reason && (
        <div className={`alert-banner ${device.threat_level}`}>
          <AlertTriangle size={20} color={device.threat_level === "danger" ? "var(--danger)" : "var(--warning)"} />
          <div>
            <div className="alert-title">
              {device.threat_level === "danger" ? "Threat Detected" : "Suspicious Activity"}
            </div>
            <div className="alert-desc">{device.threat_reason}</div>
          </div>
        </div>
      )}

      {/* Info grid */}
      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-title">Device Info</div>
          <div className="info-row"><span className="info-key">IP Address</span><span className="info-val">{device.ip}</span></div>
          <div className="info-row"><span className="info-key">MAC Address</span><span className="info-val">{device.mac || "N/A"}</span></div>
          <div className="info-row"><span className="info-key">Vendor</span><span className="info-val">{device.vendor || "Unknown"}</span></div>
          <div className="info-row"><span className="info-key">Hostname</span><span className="info-val">{device.hostname || "—"}</span></div>
          <div className="info-row"><span className="info-key">Type</span><span className="info-val">{device.is_gateway ? "Gateway/Router" : "Client Device"}</span></div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">Traffic Summary</div>
          <div className="info-row"><span className="info-key">Data Sent</span><span className="info-val" style={{ color: "var(--accent)" }}>↑ {formatBytes(device.bytes_sent)}</span></div>
          <div className="info-row"><span className="info-key">Data Received</span><span className="info-val" style={{ color: "var(--safe)" }}>↓ {formatBytes(device.bytes_recv)}</span></div>
          <div className="info-row"><span className="info-key">Status</span><span className="info-val" style={{ color: "var(--safe)" }}>● Online</span></div>
          <div className="info-row"><span className="info-key">First Seen</span><span className="info-val">{new Date(device.first_seen).toLocaleTimeString()}</span></div>
          <div className="info-row"><span className="info-key">Last Seen</span><span className="info-val">{new Date(device.last_seen).toLocaleTimeString()}</span></div>
        </div>
      </div>

      {/* Live traffic chart */}
      <div className="chart-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Live Traffic</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
            <span className="pulse-dot online" />
            Updates every 3s
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRecv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-secondary)" }} unit=" KB" width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="sent" name="Sent" stroke="#6366f1" strokeWidth={2} fill="url(#gradSent)" dot={false} />
            <Area type="monotone" dataKey="recv" name="Received" stroke="#10b981" strokeWidth={2} fill="url(#gradRecv)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Open ports */}
      <div className="detail-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="detail-card-title" style={{ margin: 0 }}>Open Ports</div>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={scanPorts} disabled={scanningPorts}>
            <Wifi size={12} />
            {scanningPorts ? "Scanning..." : "Rescan Ports"}
          </button>
        </div>
        {openPorts.length === 0 ? (
          <div style={{ color: "var(--text-secondary)", fontSize: 13, padding: "8px 0" }}>
            <Shield size={14} style={{ display: "inline", marginRight: 6 }} />
            No open ports detected
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {openPorts.map(port => (
              <div key={port} style={{
                padding: "10px 14px",
                background: RISKY_PORTS.has(port) ? "var(--danger-bg)" : "var(--bg-secondary)",
                border: `1px solid ${RISKY_PORTS.has(port) ? "var(--danger-border)" : "var(--border)"}`,
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: RISKY_PORTS.has(port) ? "var(--danger)" : "var(--text-primary)" }}>
                    :{port}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                    {PORT_NAMES[port] || "Unknown"}
                  </div>
                </div>
                {RISKY_PORTS.has(port) && (
                  <AlertTriangle size={14} color="var(--danger)" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}