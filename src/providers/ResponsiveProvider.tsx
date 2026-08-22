import React, { createContext, useContext, useMemo } from "react";
import { useWindowDimensions } from "react-native";

interface ResponsiveContextType {
  width: number;
  height: number;
  isLandscape: boolean;
}

export const ResponsiveContext = createContext<ResponsiveContextType>({
  width: 0,
  height: 0,
  isLandscape: false,
});

/**
 * Root Responsive Provider to auto-trigger app-wide style recalculations on screen rotation
 */
export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const value = useMemo(
    () => ({ width, height, isLandscape }),
    [width, height, isLandscape],
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => useContext(ResponsiveContext);
