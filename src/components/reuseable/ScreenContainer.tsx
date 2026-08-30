// 1. React / React Native
import { RefreshControl, ScrollView, View } from "react-native";

// 3. External libraries
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

// 6. Types
import type { ReactNode } from "react";
import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import type { Edge } from "react-native-safe-area-context";

// 7. Constants/utils
import COLORS from "@/constants/colors";
import { HP, WP } from "@/utils/getResponsiveSizes";

export interface IScreenContainerProps extends ScrollViewProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  contentClassName?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  withKeyboardAvoiding?: boolean;
  extraScrollHeight?: number;
  enableOnAndroid?: boolean;
  withSafeArea?: boolean;
  safeAreaEdges?: Edge[];
  safeAreaClassName?: string;
}

export const ScreenContainer: React.FC<IScreenContainerProps> = ({
  children,
  contentStyle,
  contentClassName = "",
  onRefresh,
  refreshing = false,
  withKeyboardAvoiding = false,
  extraScrollHeight = 25,
  enableOnAndroid = true,
  withSafeArea = true,
  safeAreaEdges = ["left", "right"],
  safeAreaClassName = "flex-1 bg-base-100",
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = "handled",
  className = "",
  ...scrollViewProps
}) => {
  const ContainerComponent = withKeyboardAvoiding
    ? KeyboardAwareScrollView
    : ScrollView;

  const keyboardProps = withKeyboardAvoiding
    ? {
        enableOnAndroid,
        enableAutomaticScroll: true,
        extraScrollHeight,
      }
    : {};

  const content = (
    <ContainerComponent
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { paddingBottom: HP("7%") },
        contentContainerStyle,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        ) : undefined
      }
      style={[
        {
          paddingHorizontal: WP("4%"),
          paddingTop: 16,
        },
        style,
      ]}
      className={`flex-1 bg-base-100 ${className}`.trim()}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...keyboardProps}
      {...scrollViewProps}
    >
      <View
        style={contentStyle}
        className={`flex-col gap-y-3 ${contentClassName}`.trim()}
      >
        {children}
      </View>
    </ContainerComponent>
  );

  if (withSafeArea) {
    return (
      <SafeAreaView edges={safeAreaEdges} className={safeAreaClassName}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

export default ScreenContainer;
