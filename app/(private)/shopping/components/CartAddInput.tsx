import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
    CheckIcon,
    CreditCardIcon,
    InfoIcon,
    MailIcon,
    SearchIcon,
    StarIcon,
  } from "lucide-react"

const CartAddInput = () => {
  return (
    <div className="flex items-center gap-2">
    <InputGroup>
      <InputGroupInput placeholder="Add New Item..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput type="text" placeholder="Quantity required..." />
      <InputGroupAddon>
        <MailIcon />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput type="text" placeholder="Amount..." />
      <InputGroupAddon>
        <CreditCardIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <CheckIcon />
      </InputGroupAddon>
    </InputGroup>
  </div>
  );
};

export default CartAddInput;
