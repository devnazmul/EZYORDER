import Button from "@/components/reuseable/Button";
import InputField from "@/components/reuseable/InputField";
import { allowedUserTypes } from "@/constants/allowedUserTypes";
import { useAuth } from "@/context/AuthContext";
import { useLoginMutation } from "@/hooks/useAuthQueries";
import { checkUserType } from "@/utils/checkUserType";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
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

    const userType = (data?.type || "").toLowerCase().trim();
    switch (userType) {
      case "restaurant_owner":
      case "owner":
        router.replace("/(tabs)/home");
        break;
      case "driver":
        router.replace("/(driver)/index");
        break;
      default:
        break;
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
    <SafeAreaView className="flex-1 bg-base-100">
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="w-full px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Branding */}
          <View className="items-center mt-8 mb-6">
            <View className="w-16 h-16 bg-primary rounded-lg items-center justify-center shadow-lg mb-4">
              <MaterialIcons name="restaurant" size={36} color="white" />
            </View>
            <Text className="text-2xl font-bold text-neutral">EZYORDER</Text>
            <Text className="text-sm text-accent mt-1">Manage your restaurant, anywhere</Text>
          </View>

          {/* Form Card */}
          <View className="bg-base-300 rounded-3xl shadow-xl p-6 mb-8 border border-base-200">
            {errorBanner && (
              <View className="flex-row items-center bg-error/15 border border-error/30 rounded-lg p-3 mb-6 gap-3 animate-pulse">
                <MaterialIcons name="error" size={20} color="#DC2D2A" />
                <Text className="flex-1 text-xs font-semibold text-primary leading-4">{errorBanner}</Text>
              </View>
            )}

            <View className="mb-6">
              <Text className="text-xl font-bold text-neutral">Welcome Back</Text>
              <Text className="text-sm text-accent mt-1">Log in to continue</Text>
            </View>

            {/* Fields List */}
            <View className="space-y-4">
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

            {/* Remember Me & Forgot Password Row - Login Only */}

            <View className="flex-row items-center justify-between mt-5 mb-2">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
                activeOpacity={0.8}
              >
                <View
                  className={`w-5 h-5 border rounded items-center justify-center mr-2 ${
                    rememberMe ? "bg-primary border-primary" : "border-accent bg-transparent"
                  }`}
                >
                  {rememberMe && <MaterialIcons name="check" size={14} color="white" />}
                </View>
                <Text className="text-xs font-medium text-accent">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-xs font-semibold text-secondary">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Primary Action Button */}
            <Button label="Log In" onPress={handleSubmit} isLoading={isLoading} containerClassName="mt-6" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
