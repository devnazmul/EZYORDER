import Button from "@/components/reuseable/Button";
import InputField from "@/components/reuseable/InputField";
import { useAuth } from "@/context/AuthContext";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { allowedUserTypes } from "../constants/allowedUserTypes";
import { useLoginMutation } from "../hooks/mutations/useAuthMutations";
import { checkUserType } from "../utils/checkUserType";

const backgroundImage = require("@/assets/images/background-image.jpg");
const logoImage = require("@/assets/images/temporary-logo.png");

const LoginScreen = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain at least one uppercase, lowercase, and number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorBanner(null);
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const onLoginSuccess = async (data: any) => {
    const allowedRoles = allowedUserTypes;

    if (!checkUserType(data, allowedRoles)) {
      setErrorBanner("Access Denied. This application is restricted for you to use.");
      return;
    }

    if (data?.token) {
      await login(data.token, data);
    }
  };

  const onLoginError = (error: any) => {
    let errorMessage = "Invalid credentials";
    const data = error?.data;
    if (error?.status === 401) {
      errorMessage = "Invalid email or password";
    } else if (data?.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      if (firstErrorKey && data.errors[firstErrorKey]?.[0]) {
        errorMessage = data.errors[firstErrorKey][0];
      }
    } else if (data?.message) {
      errorMessage = data.message;
      if (errorMessage.toLowerCase().includes("unauthenticated")) {
        errorMessage = "Invalid email or password";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    setErrorBanner(errorMessage);
  };

  const loginMutation = useLoginMutation(onLoginSuccess, onLoginError);

  const isLoading = loginMutation.isPending;

  const handleSubmit = () => {
    if (!validateForm()) return;
    loginMutation.mutate({ email: formData.email.trim(), password: formData.password });
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
        {/* Explicit dark overlay for high contrast */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
          }}
        />

        <SafeAreaView className="flex-1">
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={25}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: WP("4%") }}
            className="w-full"
          >
            {/* Header Branding with Custom Logo */}
            <View style={{ marginTop: HP("2%"), marginBottom: HP("2%") }} className="items-center">
              <Image
                source={logoImage}
                style={{
                  width: WP("44%"),
                  height: HP("8%"),
                  maxWidth: 220,
                  maxHeight: 75,
                  marginBottom: HP("0.5%"),
                }}
                resizeMode="contain"
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("lg"), color: "#FFFFFF" }}
                className="font-semibold tracking-wide text-center"
              >
                Manage your restaurant, anywhere
              </Text>
            </View>

            {/* Modern Glassmorphic Form Card */}
            <View
              style={{
                marginBottom: HP("3%"),
                padding: WP("5%"),
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 15,
                elevation: 10,
              }}
            >
              {errorBanner && (
                <View
                  style={{ padding: HP("1.5%"), marginBottom: HP("2%"), gap: WP("3%") }}
                  className="flex-row items-center bg-error/15 border border-error/30 rounded-lg animate-pulse"
                >
                  <MaterialIcons name="error" size={20} color="#DC2D2A" />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="flex-1 font-semibold text-primary leading-4"
                  >
                    {errorBanner}
                  </Text>
                </View>
              )}

              <View style={{ marginBottom: HP("1.5%") }}>
                <Text style={{ fontSize: getResponsiveFontSize("xl") }} className="font-bold text-neutral">
                  Welcome Back
                </Text>
                <Text
                  style={{ fontSize: getResponsiveFontSize("sm"), marginTop: HP("0.25%") }}
                  className="text-accent font-medium"
                >
                  Log in to continue
                </Text>
              </View>

              {/* Fields List */}
              <View style={{ gap: HP("1.5%") }}>
                {/* Email Field */}
                <InputField
                  label="Email"
                  iconName="email"
                  placeholder="you@restaurant.com"
                  value={formData.email}
                  onChangeText={(val) => handleInputChange("email", val)}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Password Field */}
                <InputField
                  label="Password"
                  iconName="lock"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(val) => handleInputChange("password", val)}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  rightIconName={showPassword ? "visibility-off" : "visibility"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
              </View>

              {/* Remember Me & Forgot Password Row */}
              <View
                style={{ marginTop: HP("2.5%"), marginBottom: HP("1%") }}
                className="flex-row items-center justify-between"
              >
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center"
                  activeOpacity={0.8}
                >
                  <View
                    style={{
                      width: WP("3.5%"),
                      height: WP("3.5%"),
                      minWidth: 18,
                      minHeight: 18,
                      marginRight: WP("2%"),
                    }}
                    className={`border rounded items-center justify-center ${
                      rememberMe ? "bg-primary border-primary" : "border-accent bg-transparent"
                    }`}
                  >
                    {rememberMe && <MaterialIcons name="check" size={14} color="white" />}
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-medium text-accent">
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text
                    style={{ fontSize: getResponsiveFontSize("sm") }}
                    className="font-semibold text-primary"
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Primary Action Button */}
              <View style={{ marginTop: HP("1.5%") }}>
                <Button label="Log In" onPress={handleSubmit} isLoading={isLoading} />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

LoginScreen.displayName = "LoginScreen";
export default LoginScreen;
