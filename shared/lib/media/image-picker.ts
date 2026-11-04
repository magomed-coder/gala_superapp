import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

type PickedAsset = ImagePicker.ImagePickerAsset | null;
type PickedAssets = ImagePicker.ImagePickerAsset[];

function showPermissionRequiredAlert(permissionName: string) {
  Alert.alert(
    "Нужен доступ",
    `${permissionName} нужен, чтобы загрузить фото. Разрешите доступ в настройках приложения.`,
    [
      {
        text: "Отмена",
        style: "cancel",
      },
      {
        text: "Открыть настройки",
        onPress: () => {
          Linking.openSettings();
        },
      },
    ],
  );
}

async function ensureMediaLibraryPermission(): Promise<boolean> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permission.granted) {
    return true;
  }

  showPermissionRequiredAlert("Доступ к галерее");
  return false;
}

async function ensureCameraPermission(): Promise<boolean> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (permission.granted) {
    return true;
  }

  showPermissionRequiredAlert("Доступ к камере");
  return false;
}

export async function pickImageFromLibrary(): Promise<PickedAsset> {
  const granted = await ensureMediaLibraryPermission();

  if (!granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0] ?? null;
}

export async function pickImagesFromLibrary(
  maxSelection?: number,
): Promise<PickedAssets> {
  const granted = await ensureMediaLibraryPermission();

  if (!granted) {
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: maxSelection,
    quality: 0.8,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets ?? [];
}

export async function pickImageFromCamera(): Promise<PickedAsset> {
  const granted = await ensureCameraPermission();

  if (!granted) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0] ?? null;
}
