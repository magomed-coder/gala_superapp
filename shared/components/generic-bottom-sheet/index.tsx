// components/ui/GenericBottomSheet.tsx
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { forwardRef } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

interface GenericBottomSheetProps {
  snapPoints: (string | number)[];
  index?: number;
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  backdropOpacity?: number;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
  children?: React.ReactNode;
  scrollable?: boolean;
  enableDynamicSizing?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  // дополнительно: пропсы для keyboard/behavior и т.п. можно тут добавить
}

const GenericBottomSheet = forwardRef<
  BottomSheetMethods,
  GenericBottomSheetProps
>(
  (
    {
      snapPoints,
      index = -1,
      enablePanDownToClose = true,
      onClose,
      backdropOpacity = 0.4,
      backgroundStyle,
      handleIndicatorStyle,
      children,
      scrollable = false,
      enableDynamicSizing = true,
      contentContainerStyle,
    },
    ref,
  ) => {
    return (
      <BottomSheet
        ref={ref}
        index={index}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        onClose={() => onClose?.()}
        backgroundStyle={[styles.sheetBackground, backgroundStyle]}
        handleIndicatorStyle={[styles.handleIndicator, handleIndicatorStyle]}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={backdropOpacity}
          />
        )}
      >
        {/* Встроенная прокрутка согласована со свайпом панели и доступна при крупном тексте. */}
        {scrollable ? (
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.scrollContent,
              contentContainerStyle,
            ]}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView
            style={[styles.contentContainer, contentContainerStyle]}
          >
            {children}
          </BottomSheetView>
        )}
      </BottomSheet>
    );
  },
);

GenericBottomSheet.displayName = "GenericBottomSheet";

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // overflow: "hidden",
  },
  sheetBackground: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 12,
  },
  handleIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
});

export default GenericBottomSheet;
