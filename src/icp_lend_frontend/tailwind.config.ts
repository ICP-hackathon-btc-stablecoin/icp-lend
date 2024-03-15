import type { Config } from "tailwindcss";
import * as constants from "./src/styles/constants";

export const colors = {
  "primary-50": "#eff8ff",
  "primary-100": "#dff0ff",
  "primary-200": "#b8e3ff",
  "primary-300": "#78cdff",
  "primary-400": "#38b6ff",
  "primary-500": "#069af1",
  "primary-600": "#007ace",
  "primary-700": "#0061a7",
  "primary-800": "#02528a",
  "primary-900": "#084572",
  "primary-950": "#062b4b",

  "secondary-50": "#f2effe",
  "secondary-100": "#e9e2fd",
  "secondary-200": "#d7cbfa",
  "secondary-300": "#c1acf5",
  "secondary-400": "#b08bee",
  "secondary-500": "#a36ee6",
  "secondary-600": "#9853d8",
  "secondary-700": "#8644be",
  "secondary-800": "#6c399a",
  "secondary-900": "#57357a",
  "secondary-950": "#42275a",

  light: "#f7f7f8",
  dark: "#050505",

  "light-toggle": "#f8e298",
  "light-toggle-2": "#efb40d",
  "dark-toggle": "#04182a",
  "dark-toggle-2": "#0e98ee",

  "base-200": "#2d2d2d"
};

const config: Config = {
  darkMode: ["class"],
  content: ["./components/*.{ts,tsx}", "./routes/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontSize: {
        "6xl": ["2.5rem", "3.25rem"],
        "4xl": ["1.5rem", "1.625rem"],
        "3xl": ["1.375rem", "1.815rem"],
        "2xl": ["1.125rem", "1.485rem"],
        base: ["1.063rem", "1.375rem"],
        sm: ["0.938rem", "1.25rem"],
        xs: ["1rem", "1.3rem"],
        "2xs": ["0.938rem", "1.25rem"],
        "3xs": ["0.813rem", "1rem"]
      },
      width: {
        sidebar: constants.SIDEBAR_WIDTH
      },
      padding: {
        sidebar: constants.SIDEBAR_WIDTH,
        topbar: constants.TOPBAR_HEIGHT
      },
      margin: {
        sidebar: constants.SIDEBAR_WIDTH,
        topbar: constants.TOPBAR_HEIGHT
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,.03), 0 20px 70px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.02)"
      },
      borderRadius: {
        card: "1.625rem"
      },
      backgroundImage: () => ({
        "grandient-main":
          "linear-gradient(rgba(98, 126, 234, 0.08) 0%, rgb(247, 247, 248) 300px, rgb(247, 247, 248) 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      })
    }
  }
};
export default config;
