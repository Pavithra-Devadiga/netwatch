import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import DeviceDetail from "./pages/DeviceDetail";
import Navbar from "./components/Navbar";
import ScanOverlay from "./components/ScanOverlay";
import "./index.css";
import Footer from "./components/Footer";

const API = "http://localhost:5000/api";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("nw-theme") || "dark");
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [stats, setStats] = useState({ total: 0, threats: 0, warnings: 0 });
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [localIp, setLocalIp] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nw-theme", theme);
  }, [theme]);

  const fetchDevices = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/devices`);
      setDevices(res.data.devices || []);
      setLastScan(res.data.last_scan);
      setScanning(res.data.scanning);
      setStats({ total: res.data.total, threats: res.data.threats, warnings: res.data.warnings });
      setLocalIp(res.data.local_ip || "");
    } catch {
      toast.error("Backend offline — run app.py first");
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const triggerScan = async () => {
    try {
      setScanning(true);
      await axios.post(`${API}/scan`);
      toast.success("Network scan started");
      setTimeout(fetchDevices, 3000);
      setTimeout(fetchDevices, 8000);
      setTimeout(fetchDevices, 15000);
    } catch {
      toast.error("Could not start scan");
      setScanning(false);
    }
  };

  const filteredDevices = devices.filter(d => {
    if (filter === "all") return true;
    if (filter === "threats") return d.threat_level === "danger";
    if (filter === "warnings") return d.threat_level === "warning";
    if (filter === "safe") return d.threat_level === "safe";
    return true;
  });

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          },
        }}
      />
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onScan={triggerScan}
        scanning={scanning}
        localIp={localIp}
      />
      <AnimatePresence mode="wait">
        {selectedDevice ? (
          <DeviceDetail
            key="detail"
            device={selectedDevice}
            onBack={() => setSelectedDevice(null)}
            theme={theme}
          />
        ) : (
          <Dashboard
            key="dashboard"
            devices={filteredDevices}
            allDevices={devices}
            stats={stats}
            lastScan={lastScan}
            scanning={scanning}
            onScan={triggerScan}
            onSelect={setSelectedDevice}
            filter={filter}
            setFilter={setFilter}
            localIp={localIp}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{scanning && <ScanOverlay />}</AnimatePresence>
      <Footer />
    </div>
  );
}