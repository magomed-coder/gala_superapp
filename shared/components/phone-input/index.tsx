import { Input } from "@/shared/components/themed-input";

type PhoneInputProps = {
  value: string;
  onChangePhone: (cleanText: string) => void;
  label?: string;
  error?: string;
} & Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChangeText" | "label" | "error"
>;

function normalizePhoneDigits(rawDigits: string) {
  if (!rawDigits) {
    return "";
  }

  if (rawDigits[0] === "8") {
    return `7${rawDigits.slice(1)}`;
  }

  if (rawDigits[0] !== "7") {
    return `7${rawDigits}`;
  }

  return rawDigits;
}

function formatPhoneNumber(digits: string) {
  if (!digits) {
    return "";
  }

  const clean = normalizePhoneDigits(digits).slice(0, 11);
  const code = clean.slice(1, 4);
  const p1 = clean.slice(4, 7);
  const p2 = clean.slice(7, 9);
  const p3 = clean.slice(9, 11);

  let formatted = "+7";

  if (code) {
    formatted += ` (${code}`;
  }

  if (code.length === 3) {
    formatted += ")";
  }

  if (p1) {
    formatted += ` ${p1}`;
  }

  if (p2) {
    formatted += `-${p2}`;
  }

  if (p3) {
    formatted += `-${p3}`;
  }

  return formatted;
}

export function PhoneInput({
  value,
  onChangePhone,
  label = "Номер телефона",
  error,
  ...rest
}: PhoneInputProps) {
  const handleChangeText = (text: string) => {
    const onlyDigits = text.replace(/\D/g, "");

    if (!onlyDigits) {
      onChangePhone("");
      return;
    }

    const normalized = normalizePhoneDigits(onlyDigits).slice(0, 11);
    onChangePhone(normalized);
  };

  return (
    <Input
      label={label}
      error={error}
      value={formatPhoneNumber(value)}
      onChangeText={handleChangeText}
      placeholder="+7 (999) 000-00-00"
      keyboardType="phone-pad"
      autoComplete="tel"
      textContentType="telephoneNumber"
      leftIcon="call-outline"
      maxLength={18}
      {...rest}
    />
  );
}
