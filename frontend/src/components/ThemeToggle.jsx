import { useState } from "react";

export default function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    document.body.classList.contains("light") ? "light" : "dark"
  );

  const toggleTheme = () => {
    const isLight = document.body.classList.contains("light");

    if (isLight) {
      document.body.classList.remove("light");
      setTheme("dark");
    } else {
      document.body.classList.add("light");
      setTheme("light");
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>

      {/* SLIDE PANEL */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          right: 0,
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          padding: 12,
          borderRadius: 12,
          width: 160,
          transform: open ? "translateY(0)" : "translateY(20px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "all 0.25s ease"
        }}
      >
        <div style={{ fontSize: 12, marginBottom: 8, color: "var(--text-muted)" }}>
          Theme Control
        </div>

        <button
          onClick={toggleTheme}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "var(--accent)",
            color: "#000",
            fontWeight: 600
          }}
        >
          Switch to {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>

      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "var(--accent)",
          boxShadow: "0 0 20px rgba(0,255,225,0.4)",
          fontSize: 18
        }}
      >
        ⚙️
      </button>
    </div>
  );
}