import {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

export function handleFieldSideEffects<
  TVal = unknown,
  TForm extends FieldValues = FieldValues,
>(
  name: string,
  val: TVal,
  getValues: UseFormGetValues<TForm>,
  setValue: UseFormSetValue<TForm>,
  onFieldChange?: (val: TVal, formValues: TForm) => Partial<TForm> | void,
): void {
  if (!onFieldChange) return;

  const currentFormValues = getValues();
  const updatedFormValues = {
    ...currentFormValues,
    [name]: val,
  } as unknown as TForm;

  const sideEffects = onFieldChange(val, updatedFormValues);
  if (sideEffects) {
    Object.keys(sideEffects).forEach((key) => {
      setValue(
        key as Parameters<typeof setValue>[0],
        sideEffects[key as keyof typeof sideEffects] as Parameters<
          typeof setValue
        >[1],
      );
    });
  }
}
