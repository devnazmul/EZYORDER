import InputField from "@/components/reuseable/InputField";
import ENV from "@/config/env";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const API_BASE_URL = ENV.API_BASE_URL;

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [cooldown, setCooldown] = useState(0);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    let interval: number;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1.0/forget-password`,
        {
          email: email.trim(),
          client_site: "dashboard",
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
      console.log("Response Data:", data);

      if (response.status >= 200 && response.status < 300) {
        showToast("Password reset link sent to your email.", "success");
        setIsSent(true);
        setCooldown(45);
      } else {
        let errorMessage = "Failed to send reset link.";
        if (response.status === 404 || response.status === 401) {
          errorMessage = "No account found for that email address";
        } else if (data?.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          if (firstErrorKey && data.errors[firstErrorKey]?.[0]) {
            errorMessage = data.errors[firstErrorKey][0];
          }
        } else if (data?.message) {
          errorMessage = data.message;
          if (
            errorMessage.toLowerCase().includes("not found") ||
            errorMessage.toLowerCase().includes("unauthenticated")
          ) {
            errorMessage = "No account found for that email address";
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

  const handleInputChange = (val: string) => {
    setEmail(val);
    setErrorBanner(null);
    if (errors.email) {
      setErrors({});
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100">
      {/* Toast Alert Notification */}
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

      {/* Header back button (only show when not sent) */}
      {!isSent && (
        <View className="absolute top-12 left-6 z-40">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-base-300 shadow-sm border border-base-200"
            activeOpacity={0.8}
          >
            <MaterialIcons name="chevron-left" size={28} color="#000000" />
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="w-full px-6"
          showsVerticalScrollIndicator={false}
        >
          {!isSent ? (
            // FORM STATE
            <View key="forgot-password-form" className="flex-1 justify-center py-12">
              {/* Header Branding */}
              <View className="items-center text-center mb-6">
                <View className="w-16 h-16 bg-primary rounded-xl items-center justify-center shadow-lg transform rotate-3">
                  <MaterialIcons name="restaurant" size={36} color="white" />
                </View>
                <Text className="text-2xl font-bold text-neutral mt-4">Gourmet Express</Text>
              </View>

              {/* Form Card */}
              <View className="bg-base-300 rounded-3xl shadow-xl p-6 mb-8 border border-base-200">
                {errorBanner && (
                  <View className="flex-row items-center bg-error/15 border border-error/30 rounded-lg p-3 mb-6 gap-3 animate-pulse">
                    <MaterialIcons name="error" size={20} color="#DC2D2A" />
                    <Text className="flex-1 text-xs font-semibold text-primary leading-4">{errorBanner}</Text>
                  </View>
                )}

                <View className="items-center mb-6">
                  <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center mb-4">
                    <MaterialIcons name="lock-open" size={28} color="#DC2D2A" />
                  </View>
                  <Text className="text-xl font-bold text-neutral">Forgot Password?</Text>
                  <Text className="text-sm text-accent text-center mt-2 leading-5">
                    Enter the email associated with your account and we'll send you a link to reset your
                    password.
                  </Text>
                </View>

                {/* Email Field */}
                <InputField
                  label="Email Address"
                  iconName="email"
                  placeholder="you@restaurant.com"
                  value={email}
                  onChangeText={handleInputChange}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Send Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className={`w-full h-12 bg-primary rounded-lg flex items-center justify-center shadow-md mt-6 flex-row gap-2 ${
                    isLoading ? "opacity-80" : ""
                  }`}
                  activeOpacity={0.9}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text className="text-white text-sm font-bold">Send Reset Link </Text>
                      <MaterialIcons name="send" size={16} color="white" />
                    </>
                  )}
                </TouchableOpacity>

                {/* Footer Link */}
                <View className="mt-6 pt-6 border-t border-base-200 flex-row items-center justify-center gap-1">
                  <Text className="text-xs text-accent">Remember your password?</Text>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-xs text-primary font-bold">Log In</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Decorative elements */}
              <View className="flex-row items-center justify-center gap-2 opacity-30">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <View className="w-2 h-2 rounded-full bg-accent" />
                <View className="w-2 h-2 rounded-full bg-accent" />
              </View>
            </View>
          ) : (
            // SUCCESS / CHECK EMAIL STATE
            <View key="check-email-success" className="flex-1 justify-between py-12 items-center">
              {/* Dummy spacing at top to vertically balance */}
              <View className="h-16" />

              {/* Main Content Area */}
              <View className="items-center w-full max-w-sm px-4">
                {/* Success Icon Badge */}
                <View className="w-24 h-24 mb-8 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                  <MaterialIcons name="mark-email-read" size={48} color="#36D399" />
                </View>

                {/* Heading */}
                <Text className="text-2xl font-bold text-neutral text-center mb-4">Check Your Email</Text>

                {/* Body Text */}
                <View className="items-center mb-8">
                  <Text className="text-sm text-accent text-center leading-5">
                    We've sent a password reset link to
                  </Text>
                  <Text className="text-sm font-bold text-neutral text-center my-1">{email}</Text>
                  <Text className="text-sm text-accent text-center leading-5 mt-1">
                    Click the link in the email to reset your password.
                  </Text>
                </View>

                {/* Primary Action - Open Email App */}
                <TouchableOpacity
                  onPress={() => Linking.openURL("mailto:")}
                  className="w-full h-12 flex-row bg-base-300 border border-neutral/20 rounded-lg items-center justify-center gap-2 shadow-sm"
                  activeOpacity={0.8}
                >
                  <Text className="text-neutral text-sm font-bold">Open Email App</Text>
                  <MaterialIcons name="open-in-new" size={18} color="#000000" />
                </TouchableOpacity>

                {/* Resend Section */}
                <View className="mt-8 items-center space-y-2">
                  <View className="flex-row items-center justify-center gap-1">
                    <Text className="text-sm text-accent">Didn't receive the email?</Text>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={cooldown > 0 || isLoading}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-sm font-bold text-secondary ${
                          cooldown > 0 || isLoading ? "opacity-50" : ""
                        }`}
                      >
                        Resend
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Cooldown Timer */}
                  {cooldown > 0 && (
                    <View className="flex-row items-center justify-center">
                      <Text className="text-xs text-accent tracking-wide">You can resend in </Text>
                      <Text className="text-xs font-semibold text-neutral">
                        00:{cooldown < 10 ? `0${cooldown}` : cooldown}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Footer */}
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
                className="mt-12"
                activeOpacity={0.8}
              >
                <Text className="text-sm text-accent font-semibold">Back to Log In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
