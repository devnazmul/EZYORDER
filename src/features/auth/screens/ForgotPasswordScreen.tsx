// 1. React / React Native
import React, { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

// 4. Shared components
import { CustomForm } from "@/components/form/CustomForm";
import InputField from "@/components/form/input/InputField";

// 5. Feature components/hooks
import { useForgotPasswordMutation } from "../hooks/mutations/useAuthMutations";

// 6. Types / Schemas
import { forgotPasswordSchema, type IForgotPasswordFormData } from "../schema";

const ForgotPasswordScreen = () => {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown]);

  const forgotPasswordMutation = useForgotPasswordMutation(
    async () => {
      setIsSent(true);
      setCooldown(45);
    },
    (error: unknown) => {
      let errorMessage = "Failed to send reset link.";
      const err = error as {
        status?: number;
        data?: { errors?: Record<string, string[]>; message?: string };
      };
      if (err?.status === 404 || err?.status === 401) {
        errorMessage = "No account found for that email address";
      } else if (err?.data?.errors) {
        const firstErrorKey = Object.keys(err.data.errors)[0];
        if (firstErrorKey && err.data.errors[firstErrorKey]?.[0]) {
          errorMessage = err.data.errors[firstErrorKey][0];
        }
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
        if (
          errorMessage.toLowerCase().includes("not found") ||
          errorMessage.toLowerCase().includes("unauthenticated")
        ) {
          errorMessage = "No account found for that email address";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorBanner(errorMessage);
    },
  );

  const handleFormSubmit = async (data: IForgotPasswordFormData) => {
    setErrorBanner(null);
    setSubmittedEmail(data.email.trim());
    await forgotPasswordMutation.mutateAsync(data.email.trim());
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100">
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

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="w-full px-6"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isSent ? (
          // FORM STATE
          <View
            key="forgot-password-form"
            className="flex-1 justify-center py-12"
          >
            {/* Header Branding */}
            <View className="items-center text-center mb-6">
              <View className="w-16 h-16 bg-primary rounded-xl items-center justify-center shadow-lg transform rotate-3">
                <MaterialIcons name="restaurant" size={36} color="white" />
              </View>
              <Text className="text-2xl font-bold text-neutral mt-4">
                Gourmet Express
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-base-300 rounded-3xl shadow-xl p-6 mb-8 border border-base-200">
              {Boolean(errorBanner) && (
                <View className="flex-row items-center bg-error/15 border border-error/30 rounded-lg p-3 mb-6 gap-3 animate-pulse">
                  <MaterialIcons name="error" size={20} color="#DC2D2A" />
                  <Text className="flex-1 text-xs font-semibold text-primary leading-4">
                    {errorBanner}
                  </Text>
                </View>
              )}

              <View className="items-center mb-6">
                <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center mb-4">
                  <MaterialIcons name="lock-open" size={28} color="#DC2D2A" />
                </View>
                <Text className="text-xl font-bold text-neutral">
                  Forgot Password?
                </Text>
                <Text className="text-sm text-accent text-center mt-2 leading-5">
                  Enter the email associated with your account and we{"'"}ll
                  send you a link to reset your password.
                </Text>
              </View>

              {/* CustomForm Integration */}
              <CustomForm
                schema={forgotPasswordSchema}
                defaultValues={{ email: "" }}
                submitHandler={handleFormSubmit}
                submitButtonLabel="Send Reset Link"
                showFormActionButton={true}
              >
                <InputField
                  name="email"
                  label="Email Address"
                  iconName="email"
                  placeholder="you@restaurant.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </CustomForm>

              {/* Footer Link */}
              <View className="mt-6 pt-6 border-t border-base-200 flex-row items-center justify-center gap-1">
                <Text className="text-xs text-accent">
                  Remember your password?
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-xs text-primary font-bold">Log In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Decorative elements */}
            <View className="flex-row items-center justify-center gap-2 opacity-30">
              <View className="w-2 h-2 rounded-full bg-primary" />
              <View className="w-2 h-2 rounded-full bg-accent" />
            </View>
          </View>
        ) : (
          // SUCCESS / CHECK EMAIL STATE
          <View
            key="check-email-success"
            className="flex-1 justify-between py-12 items-center"
          >
            <View className="h-16" />

            <View className="items-center w-full max-w-sm px-4">
              <View className="w-24 h-24 mb-8 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                <MaterialIcons
                  name="mark-email-read"
                  size={48}
                  color="#36D399"
                />
              </View>

              <Text className="text-2xl font-bold text-neutral text-center mb-4">
                Check Your Email
              </Text>

              <View className="items-center mb-8">
                <Text className="text-sm text-accent text-center leading-5">
                  We{"'"}ve sent a password reset link to
                </Text>
                <Text className="text-sm font-bold text-neutral text-center my-1">
                  {submittedEmail}
                </Text>
                <Text className="text-sm text-accent text-center leading-5 mt-1">
                  Click the link in the email to reset your password.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL("mailto:")}
                className="w-full h-12 flex-row bg-base-300 border border-neutral/20 rounded-lg items-center justify-center gap-2 shadow-sm"
                activeOpacity={0.8}
              >
                <Text className="text-neutral text-sm font-bold">
                  Open Email App
                </Text>
                <MaterialIcons name="open-in-new" size={18} color="#000000" />
              </TouchableOpacity>

              <View className="mt-8 items-center space-y-2">
                <View className="flex-row items-center justify-center gap-1">
                  <Text className="text-sm text-accent">
                    Didn{"'"}t receive the email?
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleFormSubmit({ email: submittedEmail })}
                    disabled={cooldown > 0 || forgotPasswordMutation.isPending}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-sm font-bold text-secondary ${
                        cooldown > 0 || forgotPasswordMutation.isPending
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>

                {cooldown > 0 && (
                  <View className="flex-row items-center justify-center">
                    <Text className="text-xs text-accent tracking-wide">
                      You can resend in{" "}
                    </Text>
                    <Text className="text-xs font-semibold text-neutral">
                      00:{cooldown < 10 ? `0${cooldown}` : cooldown}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              className="mt-12"
              activeOpacity={0.8}
            >
              <Text className="text-sm text-accent font-semibold">
                Back to Log In
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

ForgotPasswordScreen.displayName = "ForgotPasswordScreen";
export default ForgotPasswordScreen;
