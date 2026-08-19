import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { View, ViewStyle } from "react-native";
import { ZodType } from "zod";
import FormActionButton from "./FormActionButton";

interface ICustomFormProps<T extends FieldValues> {
  readonly schema?: ZodType<T>;
  readonly defaultValues?: DefaultValues<T>;
  readonly submitHandler: SubmitHandler<T>;
  readonly children: ReactNode;
  readonly className?: string;
  readonly actionButtonClassName?: string;
  readonly cancelHandler?: () => void;
  readonly showFormActionButton?: boolean;
  readonly submitButtonLabel?: string;
  readonly style?: ViewStyle;
}

export function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  submitHandler,
  children,
  className,
  actionButtonClassName,
  cancelHandler,
  showFormActionButton = true,
  submitButtonLabel,
  style,
}: ICustomFormProps<T>) {
  const formConfig: any = {};
  if (schema) formConfig.resolver = zodResolver(schema as any);
  if (defaultValues) formConfig.values = defaultValues;

  const methods = useForm<T>(formConfig);

  const {
    handleSubmit,
    setError,
    formState: { isLoading, isSubmitting, isValidating },
  } = methods;

  const onSubmit = async (data: T) => {
    try {
      await Promise.resolve(submitHandler(data));
      methods.reset();
    } catch (err: any) {
      // Keep values on error so the user doesn't lose their input
      methods.reset(undefined, { keepValues: true });

      const errorStatus = err?.response?.status || err?.status;
      if (errorStatus === 422) {
        // Parse Laravel/standard backend validation errors
        const errors = err?.response?.data?.errors || err?.data?.errors;

        if (errors && typeof errors === "object") {
          Object.keys(errors).forEach((field) => {
            const fieldErrors = errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((errorMessage: string) => {
                setError(field as any, {
                  type: "server",
                  message: errorMessage,
                });
              });
            } else if (typeof fieldErrors === "string") {
              setError(field as any, { type: "server", message: fieldErrors });
            }
          });
        }
      } else {
        // If it's not a 422, let the parent component or error boundary handle it
        throw err;
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <View className={className} style={style}>
        {children}
        {showFormActionButton && (
          <FormActionButton
            isLoading={isLoading || isValidating || isSubmitting}
            onPress={handleSubmit(onSubmit)}
            cancelHandler={cancelHandler}
            className={actionButtonClassName}
            label={submitButtonLabel}
          />
        )}
      </View>
    </FormProvider>
  );
}
