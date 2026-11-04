import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { type StyleProp, type ViewStyle } from "react-native";

import { Button } from "@/shared/components/themed-button";
import { pickImageFromLibrary } from "@/shared/lib/media/image-picker";
import { useAppTheme } from "@/shared/theme";

type ImagePickerButtonProps = {
  onImageSelected: (uri: string) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ImagePickerButton({
  onImageSelected,
  label = "Выбрать фото",
  disabled,
  style,
}: ImagePickerButtonProps) {
  const theme = useAppTheme();
  const [loading, setLoading] = useState(false);

  const leftIcon = useMemo(
    () => (
      <Ionicons
        name="camera-outline"
        size={18}
        color={theme.colors.brand.onPrimary}
      />
    ),
    [theme.colors.brand.onPrimary],
  );

  const handlePickImage = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const picked = await pickImageFromLibrary();

      if (!picked?.uri) {
        return;
      }

      onImageSelected(picked.uri);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      label={label}
      onPress={handlePickImage}
      leftIcon={leftIcon}
      loading={loading}
      disabled={disabled}
      style={style}
    />
  );
}
