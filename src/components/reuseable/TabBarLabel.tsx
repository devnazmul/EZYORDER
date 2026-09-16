import { Text } from "react-native";

export interface ITabBarLabelProps {
  title: string;
  color: string;
}

export function TabBarLabel({ title, color }: Readonly<ITabBarLabelProps>) {
  return (
    <Text
      style={{
        color,
        fontSize: 10.5,
        fontWeight: "600",
        marginTop: 2,
        textAlign: "center",
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {title}
    </Text>
  );
}

export default TabBarLabel;
