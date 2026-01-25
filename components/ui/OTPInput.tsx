import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Title } from "./Title";

interface OTPInputProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [serverError, setServerError] = useState("");
  const otpInputs = useRef<TextInput[]>([]);

  const { minutes, seconds, isCounting, resetTimer } = useCountdownTimer();

  const handleOtpChange = async (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        try {
          setServerError("");
          await onVerify(fullOtp);
        } catch (error) {
          setServerError("Неверный код подтверждения");
        }
      }
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setServerError("");
      await onResend();
      resetTimer();
      Alert.alert("Успех", "Новый код отправлен на ваш email");
    } catch (error) {
      setServerError("Не удалось отправить код. Попробуйте снова.");
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Подтверждение Email</Title>

      <Text variant="u400.14" style={styles.subtitle}>
        {email
          ? `Код отправлен на ${email}.\nВведите его ниже:`
          : "Код отправлен на ваш email.\nВведите его ниже:"}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => {
              if (ref) {
                otpInputs.current[index] = ref;
              }
            }}
            editable={!isLoading}
          />
        ))}
      </View>

      {serverError ? (
        <Text variant="u400.14" style={styles.errorText}>
          {serverError}
        </Text>
      ) : null}

      <Button
        title="Подтвердить"
        onPress={() => onVerify(otp.join(""))}
        iconRight={<Feather name="check-circle" size={18} color="#fff" />}
      />

      {isCounting ? (
        <Text variant="u400.14" style={styles.countdown}>
          Отправить код повторно через {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResend} disabled={isLoading}>
          <Text variant="u500.14" style={styles.resendLink}>
            Отправить код повторно
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
  },
  otpInputFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f2ff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#99caff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  countdown: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  resendLink: {
    textAlign: "center",
    color: "#007AFF",
    paddingTop: 10,
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 15,
    marginTop: -15,
  },
});

export default OTPInput;
