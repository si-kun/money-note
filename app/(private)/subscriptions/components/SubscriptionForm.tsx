import { SubscriptionFormType } from "@/app/types/zod/subscription";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SubscriptionFormProps {
  formMethods: UseFormReturn<SubscriptionFormType>;

  // 関数
  submitSubscription: (data: SubscriptionFormType) => Promise<void>;
  handleCancel: () => void;

  // 状態管理
  startOpen: boolean;
  setStartOpen: (open: boolean) => void;
  endOpen: boolean;
  setEndOpen: (open: boolean) => void;
  submitButtonText: string
}

const SubscriptionForm = ({
  formMethods,
  submitSubscription,
  handleCancel,
  startOpen,
  setStartOpen,
  endOpen,
  setEndOpen,
  submitButtonText
}: SubscriptionFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = formMethods;

  return (
    <Form {...formMethods}>
      <form
        onSubmit={handleSubmit(submitSubscription)}
        className="gap-4 w-full flex flex-col"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="monthlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MonthlyPrice</FormLabel>
              <FormControl>
                <Input type="number" placeholder="shadcn" {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      Start Date
                    </Label>
                    <Popover open={startOpen} onOpenChange={setStartOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value, "yyyy/MM/dd")
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setStartOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      End Date
                    </Label>
                    <Popover open={endOpen} onOpenChange={setEndOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value, "yyyy/MM/dd")
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          captionLayout="dropdown"
                          {...field}
                          onSelect={(date) => {
                            field.onChange(date);
                            setEndOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isSubmitting ? (
          <div className="flex gap-2 justify-end">
            <Button
              disabled={isSubmitting}
              className="disabled:bg-slate-400"
              type="button"
            >
              送信中...
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <Button
              disabled={!isValid}
              className="bg-green-500 hover:bg-green-400 disabled:bg-slate-400"
              type="submit"
            >
              {submitButtonText}
            </Button>
            <Button type="button" variant={"secondary"} onClick={handleCancel}>
              キャンセル
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default SubscriptionForm;
