// components/ui/GenericBottomSheet.tsx
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { forwardRef } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface GenericBottomSheetProps
  extends Pick<
    BottomSheetProps,
    | "keyboardBehavior"
    | "keyboardBlurBehavior"
    | "enableBlurKeyboardOnGesture"
    | "android_keyboardInputMode"
    | "topInset"
    | "footerComponent"
  > {
  snapPoints: (string | number)[];
  index?: number;
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  backdropOpacity?: number;
  backgroundStyle?: object;
  handleIndicatorStyle?: object;
  children?: React.ReactNode;
  scrollable?: boolean;
  fillContent?: boolean;
  enableDynamicSizing?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/** Общая панель с жестами; параметры клавиатуры и safe area передаются только сценариями, которым они нужны. */
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
      fillContent = false,
      enableDynamicSizing = true,
      contentContainerStyle,
      keyboardBehavior,
      keyboardBlurBehavior,
      enableBlurKeyboardOnGesture,
      android_keyboardInputMode,
      topInset,
      footerComponent,
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
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        enableBlurKeyboardOnGesture={enableBlurKeyboardOnGesture}
        android_keyboardInputMode={android_keyboardInputMode}
        topInset={topInset}
        footerComponent={footerComponent}
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
        {/* Собственные scrollables получают доступную высоту между шапкой и нижним действием, без absolute-обёртки BottomSheetView. */}
        {fillContent ? (
          <View style={[styles.contentContainer, contentContainerStyle]}>
            {children}
          </View>
        ) : scrollable ? (
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
