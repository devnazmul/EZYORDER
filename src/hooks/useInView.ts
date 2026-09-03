// 1. React / React Native
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

export interface IUseInViewOptions {
  readonly threshold?: number;
  readonly checkInterval?: number;
  readonly enabled?: boolean;
}

export function useInView<T extends View = View>(
  elementHeight?: number,
  options: IUseInViewOptions = {},
) {
  const { threshold = 0.8, checkInterval = 250, enabled = true } = options;
  const { height: screenHeight } = useWindowDimensions();
  const containerRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  const checkVisibility = useCallback(() => {
    if (isInView || !containerRef.current || !enabled) return;

    containerRef.current.measureInWindow((_x, y, _width, height) => {
      const targetHeight = height || elementHeight || 0;
      const visibleThreshold = Math.max(20, targetHeight * threshold);
      const isVisibleFromBottom = y + visibleThreshold <= screenHeight;
      const isVisibleFromTop = y + targetHeight - visibleThreshold >= 0;

      if (isVisibleFromBottom && isVisibleFromTop) {
        setIsInView(true);
      }
    });
  }, [elementHeight, enabled, isInView, screenHeight, threshold]);

  useEffect(() => {
    if (isInView || !enabled) return;

    checkVisibility();
    const interval = setInterval(checkVisibility, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, checkVisibility, enabled, isInView]);

  return { containerRef, isInView, checkVisibility };
}

export default useInView;
