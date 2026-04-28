"use client";

import { createContext, useContext, type ReactNode } from "react";

const SpecialDayContext = createContext<boolean>(false);

export function SpecialDayProvider({
  children,
  isSpecialDay,
}: {
  children: ReactNode;
  isSpecialDay: boolean;
}) {
  return (
    <SpecialDayContext.Provider value={isSpecialDay}>
      {children}
    </SpecialDayContext.Provider>
  );
}

export function useSpecialDay(): boolean {
  return useContext(SpecialDayContext);
}
