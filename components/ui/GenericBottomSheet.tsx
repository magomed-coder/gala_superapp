// components/ui/GenericBottomSheet.tsx
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";

interface GenericBottomSheetProps {
  snapPoints: (string | number)[];
  index?: number;
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  backdropOpacity?: number;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
  children?: React.ReactNode;
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
    },
    ref
  ) => {
    return (
      <BottomSheet
        ref={ref}
        index={index}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
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
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

GenericBottomSheet.displayName = "GenericBottomSheet";

const styles = StyleSheet.create({
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
