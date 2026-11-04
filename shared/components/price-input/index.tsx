import { Input } from "@/shared/components/themed-input";
import type { InputProps } from "@/shared/components/themed-input";

type PriceInputProps = Omit<
  InputProps,
  "value" | "onChangeText" | "keyboardType"
> & {
  value: string | number;
  onChangeAmount: (amount: number) => void;
};

function formatAmount(num: string | number): string {
  if (!num) {
    return "";
  }

  const [integerPart, decimalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

function normalizeAmountText(text: string): string {
  let cleanText = text.replace(/,/g, ".");
  cleanText = cleanText.replace(/[^0-9.]/g, "");

  const [integerPart = "", ...rest] = cleanText.split(".");
  const decimalPart = rest.join("").slice(0, 2);

  if (rest.length === 0) {
    return integerPart;
  }

  return `${integerPart}.${decimalPart}`;
}

export function PriceInput({
  value,
  onChangeAmount,
  label = "Сумма",
  placeholder = "0",
  maxLength = 15,
  ...props
}: PriceInputProps) {
  const handleChangeText = (text: string) => {
    const normalized = normalizeAmountText(text);

    if (!normalized) {
      onChangeAmount(0);
      return;
    }

    const parsed = Number.parseFloat(normalized);
    if (Number.isNaN(parsed)) {
      onChangeAmount(0);
      return;
    }

    onChangeAmount(parsed);
  };

  return (
    <Input
      {...props}
      label={label}
      value={formatAmount(value)}
      onChangeText={handleChangeText}
      keyboardType="decimal-pad"
      placeholder={placeholder}
      maxLength={maxLength}
      leftIcon={props.leftIcon}
      autoComplete="off"
      autoCorrect={false}
    />
  );
}
