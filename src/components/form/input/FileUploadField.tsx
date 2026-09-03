// 1. React / React Native
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import CustomText from "@/components/reuseable/CustomText";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

// 7. Constants / utils
import { ENV } from "@/config/env";
import { COLORS } from "@/constants/colors";
import { WP } from "@/utils/getResponsiveSizes";
import { handleFieldSideEffects } from "./handleFieldSideEffects";

export interface IFileUploadFieldProps {
  readonly name: string;
  readonly label?: string;
  readonly buttonText?: string;
  readonly className?: string;
  readonly allowedTypes?: string[];
  readonly multiple?: boolean;
  readonly onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

const isImageUri = (uri: string): boolean => {
  if (!uri) return false;
  const lower = uri.toLowerCase();
  return (
    lower.startsWith("data:image/") ||
    lower.startsWith("file://") ||
    lower.startsWith("content://") ||
    /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(lower)
  );
};

const getPreviewUri = (url: string): string => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("file://") ||
    url.startsWith("content://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const baseUrl = ENV.API_BASE_URL.replace(/\/api\/?$/, "");
  return `${baseUrl}/${url.replace(/^\//, "")}`;
};

const getFileName = (uri: string): string => {
  if (!uri) return "File";
  const parts = uri.split("/");
  const fileName = parts.at(-1) || "File";
  return fileName.split("?")[0];
};

export default function FileUploadField({
  name,
  label = "Receipt Documents / Images",
  buttonText = "Attach Receipt or Document",
  className = "",
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  multiple = true,
  onFieldChange,
}: Readonly<IFileUploadFieldProps>) {
  const { control, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const fileUrls: string[] = Array.isArray(value) ? value : [];

        const handlePickDocument = async () => {
          try {
            const result = await DocumentPicker.getDocumentAsync({
              type: allowedTypes,
              multiple,
              copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const selectedUris = result.assets.map((asset) => asset.uri);
              const updated = multiple
                ? [...fileUrls, ...selectedUris]
                : selectedUris;
              onChange(updated);
              handleFieldSideEffects(
                name,
                updated,
                getValues,
                setValue,
                onFieldChange,
              );
            }
          } catch (err) {
            console.error("Error picking document:", err);
          }
        };

        const handleRemove = (indexToRemove: number) => {
          const updated = fileUrls.filter((_, idx) => idx !== indexToRemove);
          onChange(updated);
          handleFieldSideEffects(
            name,
            updated,
            getValues,
            setValue,
            onFieldChange,
          );
        };

        return (
          <View className={`w-full ${className}`}>
            <InputLabel label={label} className="capitalize mb-2" />

            {/* Thumbnail / Document Preview List */}
            {fileUrls.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-3 flex-row"
              >
                {fileUrls.map((url, index) => {
                  const isImg = isImageUri(url);
                  const isPdf = url.toLowerCase().includes(".pdf");
                  const fileName = getFileName(url);
                  const previewUri = getPreviewUri(url);

                  let previewContent: React.ReactNode;
                  if (isImg) {
                    previewContent = (
                      <Image
                        source={{ uri: previewUri }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                      />
                    );
                  } else if (isPdf) {
                    previewContent = (
                      <View className="items-center justify-center flex-1 px-1">
                        <MaterialIcons
                          name="picture-as-pdf"
                          size={26}
                          color={COLORS.error}
                        />
                        <CustomText
                          variant="secondary"
                          size="xs"
                          weight="semibold"
                          numberOfLines={1}
                          className="mt-1 text-center"
                        >
                          {fileName}
                        </CustomText>
                      </View>
                    );
                  } else {
                    previewContent = (
                      <View className="items-center justify-center flex-1 px-1">
                        <MaterialIcons
                          name="insert-drive-file"
                          size={26}
                          color={COLORS.primary}
                        />
                        <CustomText
                          variant="secondary"
                          size="xs"
                          weight="semibold"
                          numberOfLines={1}
                          className="mt-1 text-center"
                        >
                          {fileName}
                        </CustomText>
                      </View>
                    );
                  }

                  return (
                    <View
                      key={`${url}-${index}`}
                      style={{ width: WP("20%"), height: WP("20%") }}
                      className="relative mr-3 rounded-xl border border-base-200 overflow-hidden bg-base-200 items-center justify-center p-1"
                    >
                      {previewContent}

                      <TouchableOpacity
                        onPress={() => handleRemove(index)}
                        activeOpacity={0.7}
                        style={{ width: WP("5%"), height: WP("5%") }}
                        className="absolute top-1 right-1 rounded-full bg-neutral/80 items-center justify-center z-10"
                      >
                        <MaterialIcons
                          name="close"
                          size={WP("3%")}
                          color={COLORS.base300}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            {/* Document Picker Trigger Button */}
            <TouchableOpacity
              onPress={handlePickDocument}
              activeOpacity={0.8}
              style={{ padding: WP("3.5%") }}
              className="flex-row items-center justify-center bg-base-100 border border-dashed border-base-200 rounded-xl"
            >
              <MaterialIcons
                name="attach-file"
                size={WP("5%")}
                color={COLORS.primary}
              />
              <CustomText
                variant="secondary"
                size="xs"
                weight="medium"
                className="ml-2"
              >
                {buttonText}
              </CustomText>
            </TouchableOpacity>

            {Boolean(error?.message) && (
              <InputError errorMessage={error?.message || ""} />
            )}
          </View>
        );
      }}
    />
  );
}
