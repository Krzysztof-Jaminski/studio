"use client";

import { AppContextProvider } from "@/contexts/app-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
