"use client";

import "./globals.css";

import { Poppins, Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { NextAppProvider } from "@toolpad/core/nextjs";
import NAVIGATION from "./_utils/navigation";
import theme from "../theme";
import { Suspense } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardProvider } from "@/contexts/DashboardContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <DashboardProvider>
            <AppRouterCacheProvider>
              <Suspense fallback={<div>loading</div>}>
                <NextAppProvider navigation={NAVIGATION} theme={theme}>
                  {children}
                </NextAppProvider>
              </Suspense>
            </AppRouterCacheProvider>
          </DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
