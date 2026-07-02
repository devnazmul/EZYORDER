import InputField from "@/components/InputField";
import ENV from "@/config/env";
import authStore from "@/utils/authStore";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const API_BASE_URL = ENV.API_BASE_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Toast Alert Notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth`,
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          validateStatus: () => true,
        },
      );

      const data = response.data;

      if (response.status >= 200 && response.status < 300) {
        showToast("User logged in successfully", "success");

        // Save token details internally
        console.log("Token:", data?.token);
        console.log("User details:", data);

        if (data?.token) {
          await authStore.saveSession(data.token, data);
        }

        router.replace("/(tabs)/home");
      } else {
        let errorMessage = "Invalid credentials";
        if (response.status === 401) {
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
        }
        setErrorBanner(errorMessage);
      }
    } catch (error: any) {
      console.error(error);
      setErrorBanner("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Elegant Toast Message Banner */}
      {toast && (
        <View
          className={`absolute top-12 left-4 right-4 z-50 p-4 rounded-xl shadow-lg flex-row items-center border ${
            toast.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <MaterialIcons
            name={toast.type === "success" ? "check-circle" : "error"}
            size={24}
            color={toast.type === "success" ? "#16a34a" : "#dc2626"}
          />
          <Text
            className={`ml-3 font-semibold flex-1 text-sm ${
              toast.type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {toast.message}
          </Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="w-full px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Branding */}
          <View className="items-center text-center mt-8 mb-6">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg mb-4">
              <MaterialIcons name="restaurant" size={36} color="white" />
            </View>
            <Text className="text-2xl font-bold text-neutral">Gourmet Express</Text>
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
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`w-full h-12 bg-primary rounded-lg items-center justify-center shadow-md mt-6 ${
                isLoading ? "opacity-80" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-sm font-bold">Log In</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
