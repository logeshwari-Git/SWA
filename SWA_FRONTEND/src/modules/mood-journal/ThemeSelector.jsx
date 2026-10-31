import { motion } from "framer-motion";

const themes = [
  { id: "theme-purple", label: "💜 Calm" },
  { id: "theme-ocean", label: "🌊 Ocean" },
  { id: "theme-sunset", label: "🌅 Sunset" },
  { id: "theme-dark", label: "🌙 Dark" }
];

export default function ThemeSelector({ setTheme }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      {themes.map(t => (
        <motion.button
          key={t.id}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setTheme(t.id)}
          style={{
            border: "none",
            padding: "10px 14px",
            borderRadius: 14,
            cursor: "pointer",
            background: "var(--card)"
          }}
        >
          {t.label}
        </motion.button>
      ))}
    </div>
  );
}
