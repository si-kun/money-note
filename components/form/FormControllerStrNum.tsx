import { Controller } from 'react-hook-form'

import {
    Field,
    FieldError,
    FieldLabel,
  } from "@/components/ui/field";
import { Input } from '../ui/input';

interface FormControllerStrNumProps {
    name: string;
    label: string;
    control: any;
    type?: "text" | "number";
    placeholder: string;
}

const FormControllerStrNum = ({name,label,control,type = "text",placeholder}:FormControllerStrNumProps) => {
  return (
    <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={name}>
          {label}
        </FieldLabel>
        <Input
          {...field}
          type={type}
          id={name}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete="off"
        />
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        )}
      </Field>
    )}
  />
  )
}

export default FormControllerStrNum