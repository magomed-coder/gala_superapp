import { ListingImage } from "@/features/services/components/listing-image";
import type { CatalogListing } from "@/features/services/types/catalog.types";
import { IconButton } from "@/shared/components/icon-button";
import { useAppTheme } from "@/shared/theme";
import { Modal, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Показывает исходное изображение целиком; системный возврат и крестик закрывают просмотр. */
export function ListingPhotoViewer({
  listing,
  onClose,
}: {
  listing: CatalogListing;
  onClose: () => void;
}) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View
        accessibilityViewIsModal
        onAccessibilityEscape={onClose}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: theme.colors.background.primary,
        }}
      >
        {/* Единственное реальное изображение без искусственных страниц галереи. */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.xs,
          }}
        >
          <IconButton
            icon="close"
            label="Закрыть изображение"
            onPress={onClose}
          />
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.lg,
            }}
          >
            1 / 1
          </Text>
          <View style={{ width: theme.spacing.xxxl }} />
        </View>
        <ListingImage source={listing.image} label={listing.title} />
        <Text
          style={{
            padding: theme.spacing.md,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.lg,
          }}
        >
          {listing.title}
        </Text>
      </View>
    </Modal>
  );
}
