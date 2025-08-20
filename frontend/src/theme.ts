import { createTheme } from "@mui/material/styles";

// tip: remove hard-coded heading color so it adapts in both schemes
// (I’ve removed your h4 color override below)

declare module "@mui/material/styles" {}

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  defaultColorScheme: "light",
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        // Trust Blue
        primary: {
          main: "#1D73C5",    // AA with white text
          light: "#5AA3E8",
          dark:  "#124B8E",
          contrastText: "#FFFFFF",
        },
        // Healing Teal (darker so white text is accessible)
        secondary: {
          main: "#0C7465",    // AA with white text
          light: "#3FA394",
          dark:  "#074E44",
          contrastText: "#FFFFFF",
        },
        // Safer red for contrast
        error: {
          main: "#C03434",    // AA with white text
          light: "#E57373",
          dark:  "#8F2727",
          contrastText: "#FFFFFF",
        },
        // Amber with dark text for legibility
        warning: {
          main: "#E69515",
          light: "#F5B94B",
          dark:  "#A3680E",
          contrastText: "#0B1220",
        },
        // Distinct from primary (darker cyan-blue)
        info: {
          main: "#16689A",    // AA with white text
          light: "#4EA5C7",
          dark:  "#0E4E73",
          contrastText: "#FFFFFF",
        },
        // Deeper green for accessible white text
        success: {
          main: "#1C7A32",    // AA with white text
          light: "#3DAE6B",
          dark:  "#135626",
          contrastText: "#FFFFFF",
        },

        // Neutrals for healthcare cleanliness
        background: {
          default: "#F7FAFC", // app background
          paper:   "#FFFFFF", // cards, sheets
        },
        text: {
          primary:   "#0F172A", // slate-900
          secondary: "#475569", // slate-600
          disabled:  "#94A3B8", // slate-400
        },
        divider: "#E2E8F0",
      },
    },

    dark: {
      palette: {
        mode: "dark",
        // In dark, use lighter fills + dark text for accessibility
        primary: {
          main: "#5AA3E8",
          light: "#8CC4F2",
          dark:  "#2D6FAE",
          contrastText: "#0B1220",
        },
        secondary: {
          main: "#3FA394",
          light: "#6FC0B5",
          dark:  "#1B7A6D",
          contrastText: "#0B1220",
        },
        error: {
          main: "#EF6A6A",
          light: "#F29A9A",
          dark:  "#B94A4A",
          contrastText: "#0B1220",
        },
        warning: {
          main: "#F3B046",
          light: "#F6C974",
          dark:  "#B77F2E",
          contrastText: "#0B1220",
        },
        info: {
          main: "#6BC7EF",
          light: "#9FE0F8",
          dark:  "#3C9FCC",
          contrastText: "#0B1220",
        },
        success: {
          main: "#55C08C",
          light: "#86D7AC",
          dark:  "#2E9B69",
          contrastText: "#0B1220",
        },

        background: {
          default: "#0B1220", // deep navy
          paper:   "#0F172A",
        },
        text: {
          primary:   "#F1F5F9",
          secondary: "#CBD5E1",
          disabled:  "#94A3B8",
        },
        divider: "#223047",
      },
    },
  },

  typography: {
    fontFamily:
      'Inter, Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h1: { fontSize: "3rem",  fontWeight: 700, fontFamily: "Poppins, sans-serif", lineHeight: 1.2 },
    h2: { fontSize: "2.5rem",fontWeight: 700, fontFamily: "Poppins, sans-serif", lineHeight: 1.3 },
    h3: { fontSize: "2rem",  fontWeight: 600, fontFamily: "Poppins, sans-serif", lineHeight: 1.4 },
    h4: { fontSize: "1.5rem",fontWeight: 600, fontFamily: "Poppins, sans-serif", lineHeight: 1.4 },
    h5: { fontSize: "1.25rem",fontWeight: 600, fontFamily: "Poppins, sans-serif", lineHeight: 1.5 },
    h6: { fontSize: "1rem",  fontWeight: 600, fontFamily: "Poppins, sans-serif", lineHeight: 1.5 },
    body1: { fontFamily: "Inter, sans-serif", fontSize: "1rem",    lineHeight: 1.6 },
    body2: { fontFamily: "Inter, sans-serif", fontSize: "0.875rem",lineHeight: 1.6 },
  },
});

export default theme;
