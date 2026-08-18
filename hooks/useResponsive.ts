import { useContext } from "react";
import { ResponsiveContext } from "@/context/providers/ResponsiveProvider";

export const useResponsive = () => useContext(ResponsiveContext);
