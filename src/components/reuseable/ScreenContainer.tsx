// 1. React / React Native
import { RefreshControl, ScrollView, View } from "react-native";

// 3. External libraries
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 6. Types
import type { ReactNode } from "react";
import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";

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

  return (
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
            colors={[COLORS.secondary]}
            tintColor={COLORS.secondary}
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
      className={`flex-1 bg-base-200 ${className}`.trim()}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...keyboardProps}
      {...scrollViewProps}
    >
      <View
        style={[{ paddingBottom: 40 }, contentStyle]}
        className={`flex-col gap-y-5 ${contentClassName}`.trim()}
      >
        {children}
      </View>
    </ContainerComponent>
  );
};

export default ScreenContainer;
