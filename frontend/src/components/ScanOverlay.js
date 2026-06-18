import React from "react";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";

export default function ScanOverlay() {
  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="overlay-box"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
      >
        <div className="radar">
          <div className="radar-ring" />
          <div className="radar-ring" />
          <div className="radar-ring" />
          <div className="radar-center">
            <div className="radar-dot">
              <Wifi size={14} color="#fff" />
            </div>
          </div>
        </div>
        <div className="overlay-title">Scanning Nearby WiFi</div>
        <div className="overlay-sub">
          Discovering networks · Analyzing encryption<br />
          Detecting threats &amp; evil twins
        </div>
        <div className="overlay-cmd">$ nmcli device wifi list --rescan yes</div>
      </motion.div>
    </motion.div>
  );
}