import { FieldError, FieldLabel } from "@/components/ui/field";
import { ControllerFieldState } from "react-hook-form";

interface FloatingLabelProps {
  label: string;
  fieldState: ControllerFieldState;
}

const FloatingLabel = ({ label, fieldState }: FloatingLabelProps) => {
  return (
    <div
      className={
        "absolute shadow-none max-w-[90%] bg-white px-3 py-1 z-10 -top-3 left-5 text-sm text-gray-400 flex items-center gap-4"
      }
    >
      <FieldLabel>{label}</FieldLabel>
      {fieldState.invalid && <FieldError className="text-sm font-semibold" errors={[fieldState.error]} />}
    </div>
  );
};

export default FloatingLabel;
