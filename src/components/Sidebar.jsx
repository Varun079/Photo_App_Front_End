import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  { label: "Photos", icon: "📷", path: "/" },
  { label: "Albums", icon: "📁", path: "/albums" },
  { label: "Favourites", icon: "⭐", path: "/favourites" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside
      style={{
        width: 220,
        background: "#18181b",
        color: "#fff",
        minHeight: "100vh",
        padding: "32px 0 0 0",
        borderRight: "1px solid #23272f",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sidebarItems.map((item) => (
            <li
              key={item.label}
              style={{
                padding: "14px 32px",
                fontWeight: 500,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: item.path ? "pointer" : "default",
                borderRadius: 8,
                transition: "background 0.2s",
                background: item.path && location.pathname === item.path ? "#23272f" : "transparent",
              }}
              onClick={() => item.path && navigate(item.path)}
              onMouseOver={e => (e.currentTarget.style.background = "#23272f")}
              onMouseOut={e => (e.currentTarget.style.background = item.path && location.pathname === item.path ? "#23272f" : "transparent")}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export { Sidebar }; 