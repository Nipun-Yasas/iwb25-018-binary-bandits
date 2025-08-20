"use client";

import { useEffect } from "react";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (!html.getAttribute("data-toolpad-color-scheme")) {
        html.setAttribute("data-toolpad-color-scheme", "light");
      }
    }
  }, []);

  return <>{children}</>;
}


