import React, { useMemo } from "react";
import { motion } from "framer-motion";

const DEVICE_ICONS = {
  Apple: "🍎", Samsung: "📱", Cisco: "🌐", Intel: "💻",
  "Raspberry Pi": "🔴", Google: "🔵", Amazon: "📦", Unknown: "❓"
};

function getIcon(device) {
  if (device.is_gateway) return "🌐";
  return DEVICE_ICONS[device.vendor] || "💻";
}

function getColor(level) {
  if (level === "danger") return "#ef4444";
  if (level === "warning") return "#f59e0b";
  return "#10b981";
}

export default function NetworkMap({ devices, onSelect }) {
  const gateway = devices.find(d => d.is_gateway);
  const others = devices.filter(d => !d.is_gateway);

  const positions = useMemo(() => {
    const cx = 400, cy = 200, r = 140;
    return others.map((_, i) => {
      const angle = (i / Math.max(others.length, 1)) * 2 * Math.PI - Math.PI / 2;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
  }, [others.length]);

  const centerX = 400, centerY = 200;

  return (
    <svg
      viewBox="0 0 800 400"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#bgGrad)" rx="14" />

      {/* Orbit ring */}
      <circle
        cx={centerX} cy={centerY} r={140}
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      {/* Connection lines */}
      {others.map((device, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <motion.line
            key={`line-${device.ip}`}
            x1={centerX} y1={centerY}
            x2={pos.x} y2={pos.y}
            stroke={getColor(device.threat_level)}
            strokeWidth="1.5"
            strokeOpacity="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
        );
      })}

      {/* Device nodes */}
      {others.map((device, i) => {
        const pos = positions[i];
        if (!pos) return null;
        const color = getColor(device.threat_level);
        return (
          <motion.g
            key={device.ip}
            onClick={() => onSelect(device)}
            style={{ cursor: "pointer" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.15 }}
          >
            {device.threat_level !== "safe" && (
              <motion.circle
                cx={pos.x} cy={pos.y} r={22}
                fill={color} fillOpacity={0.15}
                animate={{ r: [22, 30, 22], fillOpacity: [0.15, 0.05, 0.15] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <circle
              cx={pos.x} cy={pos.y} r={18}
              fill="var(--card-bg)"
              stroke={color}
              strokeWidth="2"
            />
            <text
              x={pos.x} y={pos.y + 6}
              textAnchor="middle"
              fontSize="14"
            >
              {getIcon(device)}
            </text>
            <text
              x={pos.x} y={pos.y + 34}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-secondary)"
              fontFamily="var(--mono)"
            >
              {device.ip.split(".").slice(-1)[0] === "1" ? "router" : device.ip.split(".").slice(-1)[0]}
            </text>
          </motion.g>
        );
      })}

      {/* Gateway center node */}
      {gateway && (
        <motion.g
          onClick={() => onSelect(gateway)}
          style={{ cursor: "pointer" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.circle
            cx={centerX} cy={centerY} r={32}
            fill="var(--accent)"
            fillOpacity={0.1}
            animate={{ r: [32, 40, 32] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle
            cx={centerX} cy={centerY} r={26}
            fill="var(--accent)"
            fillOpacity={0.15}
          />
          <circle
            cx={centerX} cy={centerY} r={22}
            fill="var(--card-bg)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <text x={centerX} y={centerY + 7} textAnchor="middle" fontSize="18">🌐</text>
          <text
            x={centerX} y={centerY + 44}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-secondary)"
            fontFamily="var(--font)"
            fontWeight="500"
          >
            Gateway
          </text>
        </motion.g>
      )}
    </svg>
  );
}