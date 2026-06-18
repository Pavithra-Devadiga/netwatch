import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/DetailPage";
import ScanOverlay from "./components/ScanOverlay";
import Footer from "./components/Footer";
import "./index.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("nw-theme") || "dark");
  const [networks, setNetworks] = useState([]);
  const [stats, setStats] = useState({ total: 0, danger: 0, warning: 0, safe: 0, evil_twins: 0 });
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nw-theme", theme);
  }, [theme]);

  const fetchNetworks = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/networks`, { timeout: 5000 });
      setNetworks(res.data.networks || []);
      setStats({
        total: res.data.total || 0,
        danger: res.data.danger || 0,
        warning: res.data.warning || 0,
        safe: res.data.safe || 0,
        evil_twins: res.data.evil_twins || 0,
      });
      setScanning(res.data.scanning || false);
      setLastScan(res.data.last_scan);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworks();
    const iv = setInterval(fetchNetworks, 4000);
    return () => clearInterval(iv);
  }, [fetchNetworks]);

  const triggerScan = async () => {
    if (scanning) return;
    try {
      setScanning(true);
      await axios.post(`${API}/scan`, {}, { timeout: 5000 });
      toast.success("🔍 Scanning nearby WiFi networks...", { duration: 3000 });
      setTimeout(fetchNetworks, 3000);
      setTimeout(fetchNetworks, 8000);
      setTimeout(fetchNetworks, 15000);
    } catch {
      toast.error("Backend offline — run: python app.py");
      setScanning(false);
    }
  };

  const filtered = networks.filter(n => {
    if (filter === "all") return true;
    if (filter === "danger") return n.threat_level === "danger";
    if (filter === "warning") return n.threat_level === "warning";
    if (filter === "safe") return n.threat_level === "safe";
    if (filter === "open") return n.encryption === "NONE" || n.encryption === "OPEN";
    return true;
  });

  return (
    <div className="app-root">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--t1)",
            border: "1px solid var(--border2)",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onScan={triggerScan}
        scanning={scanning}
        backendOnline={backendOnline}
      />

      <AnimatePresence mode="wait">
        {selected ? (
          <DetailPage
            key="detail"
            network={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <Dashboard
            key="dash"
            networks={filtered}
            allNetworks={networks}
            stats={stats}
            lastScan={lastScan}
            scanning={scanning}
            onScan={triggerScan}
            onSelect={setSelected}
            filter={filter}
            setFilter={setFilter}
            backendOnline={backendOnline}
          />
        )}
      </AnimatePresence>

      <Footer />
      <AnimatePresence>{scanning && <ScanOverlay />}</AnimatePresence>
    </div>
  );
}