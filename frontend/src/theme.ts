import { createTheme } from "@mui/material/styles";
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

declare module "@mui/material/styles" {}

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  defaultColorScheme: "light",
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0A74DA",
          light: "#5AA9F9",
          dark: "#004A99",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#6C2DC7",
          light: "#9D5FE9",
          dark: "#45108A",
          contrastText: "#ffffff",
        },
        error: {
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff",
        },
        warning: {
          main: "#FF7A00",
          light: "#FF9F40",
          dark: "#CC5500",
          contrastText: "#fff",
        },
        info: {
          main: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056CC",
          contrastText: "#fff",
        },
        success: {
          main: "#28a745",
          light: "#5CBF70",
          dark: "#1C7A32",
          contrastText: "#fff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#0A74DA",
          light: "#5AA9F9",
          dark: "#004A99",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#6C2DC7",
          light: "#9D5FE9",
          dark: "#45108A",
          contrastText: "#ffffff",
        },
        error: {
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff",
        },
        warning: {
          main: "#FF7A00",
          light: "#FF9F40",
          dark: "#CC5500",
          contrastText: "#fff",
        },
        info: {
          main: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056CC",
          contrastText: "#fff",
        },
        success: {
          main: "#28a745",
          light: "#5CBF70",
          dark: "#1C7A32",
          contrastText: "#fff",
        },
      },
    },
  },
  components: {
    MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: 'var(--font-lexend)',
        fontWeight: 500,
        textTransform: 'none',
        '&.Mui-selected': {
          fontWeight: 600,
        }
      }
    }
  },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '--DataGrid-borderColor': '#000000',
          '[data-toolpad-color-scheme="dark"] &': {
            '--DataGrid-borderColor': '#E0E3E7', 
          },
          border: '1px solid var(--DataGrid-borderColor)',
          borderRadius: '10px',
        },
        columnHeaders: {
          borderBottom: '1px solid var(--DataGrid-borderColor)',
           '& .MuiDataGrid-columnHeader.last-column .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        },
        cell: {
          borderBottom: '1px solid var(--DataGrid-borderColor)',
        },
        columnSeparator: {
          color: 'var(--DataGrid-borderColor)',
        },
        iconSeparator: {
          color: 'var(--DataGrid-borderColor)',
        },
        footerContainer: {
          '& .MuiSvgIcon-root': {
            color: 'var(--DataGrid-borderColor)'
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-borderColor': '#E0E3E7',
          '--TextField-borderHoverColor': '#E90A4D',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'var(--TextField-borderColor)',
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-borderHoverColor)',
          },

        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&::before, &::after': {
            borderBottom: '2px solid var(--TextField-borderColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '2px solid var(--TextField-borderHoverColor)',
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&::before': {
            borderBottom: '2px solid var(--TextField-borderColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '2px solid var(--TextField-borderHoverColor)',
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="dark"] &': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="dark"] &': {
            '& .MuiTableRow-root': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="dark"] &': {
            '&[data-weekly-summary="true"]': {
              backgroundColor: 'transparent !important',
            },
            '&[style*="background-color: rgb(245, 245, 245)"]': {
              backgroundColor: 'transparent !important',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily:
      'Inter, Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.4,
      color: "#0056CC",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
});

export default theme;
