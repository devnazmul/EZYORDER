import { useContext } from "react";
import { ResponsiveContext } from "@/src/providers/ResponsiveProvider";

export const useResponsive = () => useContext(ResponsiveContext);
