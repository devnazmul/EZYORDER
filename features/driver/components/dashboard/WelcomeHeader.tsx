import { Text, View } from "react-native";

interface HeaderProps {
  user: any;
}

const WelcomeHeader: React.FC<HeaderProps> = ({ user }: HeaderProps) => {
  return (
    <View className="py-2">
      <Text className="text-xl font-medium capitalize text-neutral">
        <Text className="font-bold">Hello, </Text>
        <Text className="font-normal text-neutral">
          {user?.first_Name} {user?.last_Name}.
        </Text>
      </Text>
      <Text className="text-sm text-neutral  ">
        You are currently{" "}
        <Text
          className={`font-bold capitalize  ${user?.driver_status === "available" ? "text-success" : "text-slate-400"}`}
        >
          {user?.driver_status === "available" ? "Available For deliveries" : "Not Available For deliveries"}
        </Text>
      </Text>
    </View>
  );
};

WelcomeHeader.displayName = "Driver Dashboard Welcome Header";
export default WelcomeHeader;
