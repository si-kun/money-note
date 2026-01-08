import { Button } from "@/components/ui/button";
interface TypeToggleButtonProps {
  field: {
    value: "INCOME" | "PAYMENT";
    onChange: (value: "INCOME" | "PAYMENT") => void;
  };
  type: "INCOME" | "PAYMENT";
}

const TypeToggleButton = ({ field, type }: TypeToggleButtonProps) => {
  const isActive = field.value === type;

  return (
    <Button
      id={field.value}
      type="button"
      variant={"secondary"}
      className={`w-full py-5 ${
        isActive
          ? type === "INCOME"
            ? "bg-blue-300 hover:bg-blue-400"
            : "bg-red-300 hover:bg-red-400"
          : "opacity-70 hover:opacity-100"
      }`}
      value={field.value}
      onClick={() => field.onChange(type)}
    >
      {type === "PAYMENT" ? "支出" : "収入"}
    </Button>
  );
};

export default TypeToggleButton;
