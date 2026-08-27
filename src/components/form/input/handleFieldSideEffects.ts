import {
  FieldValues,
  Path,
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

  const updatedFormValues = {
    ...getValues(),
    [name]: val,
  } as TForm;

  const sideEffects = onFieldChange(val, updatedFormValues);
  if (!sideEffects) return;

  Object.entries(sideEffects).forEach(([key, value]) => {
    setValue(key as Path<TForm>, value as TForm[Path<TForm>]);
  });
}
