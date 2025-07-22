
"use client";

import { AppContextProvider } from "@/contexts/app-context";
import { useRouter } from 'next/navigation';
import type { ReactNode } from "react";
import { Suspense } from "react";

function AppContextProviderWithRouter({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>
            {children}
        </AppContextProvider>
    );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AppContextProviderWithRouter>{children}</AppContextProviderWithRouter>
    </Suspense>
  );
}
