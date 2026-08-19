import { CustomForm } from "@/components/form/CustomForm";
import InputField from "@/components/form/input/InputField";
import { ROLE } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { WP } from "@/utils/getResponsiveSizes";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AuthCardTitle,
  AuthErrorBanner,
  AuthHeader,
  LoginOptionsRow,
} from "../components";
import { useLoginMutation } from "../hooks/mutations";
import { ILoginFormData, loginSchema } from "../schema";
import { verifUserRole } from "../utils";

export default function LoginScreen() {
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const onLoginSuccess = async (data: any) => {
    if (!verifUserRole(data?.role?.name as ROLE)) {
      setErrorBanner(
        "Access Denied. This application is restricted for you to use.",
      );
      return;
    }

    if (data?.token) {
      await login(data.token, data);
    }
  };

  const onLoginError = (error: any) => {
    let errorMessage = "Invalid credentials";
    const data = error?.response?.data;
    if (error?.response?.status === 401 || error?.status === 401) {
      errorMessage = "Invalid email or password";
    } else if (data?.message) {
      errorMessage = data.message;
      if (errorMessage.toLowerCase().includes("unauthenticated")) {
        errorMessage = "Invalid email or password";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // We let CustomForm handle 422 validation errors, but set the banner for others
    if (error?.response?.status !== 422 && error?.status !== 422) {
      setErrorBanner(errorMessage);
    }
  };

  const loginMutation = useLoginMutation(onLoginSuccess, onLoginError);

  const handleLoginSubmit = async (data: ILoginFormData) => {
    setErrorBanner(null);
    // Use mutateAsync so the thrown error propagates back up to the CustomForm boundary
    await loginMutation.mutateAsync({
      email: data.email.trim(),
      password: data.password,
    });
  };

  return (
    <View className="flex-1 bg-base-100">
      <Stack.Screen options={{ headerShown: false }} />

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
          <AuthHeader />

          {/* Modern Glassmorphic Form Card */}
          <View
            style={{
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
            className="mb-6"
          >
            <AuthErrorBanner message={errorBanner} />
            <AuthCardTitle title="Welcome Back" subtitle="Log in to continue" />

            {/* Custom Form Block */}
            <CustomForm<ILoginFormData>
              schema={loginSchema}
              submitHandler={handleLoginSubmit}
              submitButtonLabel="Log In"
              defaultValues={{
                email: "",
                password: "",
              }}
            >
              <View className="gap-y-3.5">
                <InputField
                  name="email"
                  label="Email"
                  iconName="email"
                  placeholder="you@restaurant.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <InputField
                  name="password"
                  label="Password"
                  iconName="lock"
                  placeholder="••••••••"
                  isPassword={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <LoginOptionsRow
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
              />
            </CustomForm>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}
