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
}

const FormControllerStrNum = ({name,label,control}:FormControllerStrNumProps) => {
  return (
    <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="form-rhf-demo-title">
          {label}
        </FieldLabel>
        <Input
          {...field}
          id="form-rhf-demo-title"
          aria-invalid={fieldState.invalid}
          placeholder="Login button not working on mobile"
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