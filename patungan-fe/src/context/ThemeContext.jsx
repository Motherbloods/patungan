import { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

// Calculate the max radius needed to cover the entire screen from a corner
function getMaxRadius(x, y) {
  const w = globalThis.innerWidth;
  const h = globalThis.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

async function animateThemeTransition(isDarkNext, applyTheme) {
  // Origin: top-left corner
  const x = 0;
  const y = 0;
  const radius = getMaxRadius(x, y);

  const clipStart = `circle(0px at ${x}px ${y}px)`;
  const clipEnd = `circle(${radius}px at ${x}px ${y}px)`;

  // Fallback: no animation support
  if (!document.startViewTransition) {
    applyTheme(isDarkNext);
    return;
  }

  const keyframes = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-new(root) {
      animation: theme-clip-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes theme-clip-in {
      from { clip-path: ${clipStart}; }
      to   { clip-path: ${clipEnd}; }
    }
  `;

  // Inject or update keyframe style
  const existingStyle = document.getElementById("theme-transition-style");
  if (existingStyle) {
    existingStyle.textContent = keyframes;
  } else {
    const style = document.createElement("style");
    style.id = "theme-transition-style";
    style.textContent = keyframes;
    document.head.appendChild(style);
  }

  const transition = document.startViewTransition(() => {
    applyTheme(isDarkNext);
  });

  await transition.finished;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme class to <html> without animation (used on init & inside transition)
  const applyThemeClass = (dark) => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  // On mount: apply theme immediately (no animation)
  useEffect(() => {
    applyThemeClass(isDark);
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    await animateThemeTransition(next, applyThemeClass);
    setIsDark(next);
  };

  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
