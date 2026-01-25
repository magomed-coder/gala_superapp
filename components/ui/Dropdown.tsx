import { Text } from "@/components/ui/Text";
import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export type OptionItem = {
  key: string;
  label: string;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  selectedValue: OptionItem | null;
  placeholder: string;
}

export default function Dropdown({
  data,
  onChange,
  selectedValue,
  placeholder,
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const buttonRef = useRef<View>(null);

  const [top, setTop] = useState(0);

  const onSelect = useCallback(
    (item: OptionItem) => {
      onChange(item);
      setExpanded(false);
    },
    [onChange]
  );

  return (
    <View
      ref={buttonRef}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        const topOffset = layout.y;
        const heightOfComponent = layout.height;

        const finalValue =
          topOffset +
          heightOfComponent +
          (Platform.OS === "android" ? 3 : heightOfComponent + 10);

        setTop(finalValue);
      }}
      style={styles.wrapper}
    >
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={toggleExpanded}
      >
        <Text variant="u500.14" style={styles.text}>
          {selectedValue?.label}
        </Text>
        <AntDesign name={expanded ? "caret-up" : "caret-down"} />
      </TouchableOpacity>
      {expanded ? (
        <Modal visible={expanded} transparent>
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View style={styles.backdrop}>
              <View
                style={[
                  styles.options,
                  {
                    top,
                  },
                ]}
              >
                <FlatList
                  keyExtractor={(item) => item.key}
                  data={data}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.optionItem}
                      onPress={() => onSelect(item)}
                    >
                      <Text variant="u500.14">{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </View>
  );
}
const ITEM_HEIGHT = 45;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#8f7c7c4b",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    // marginBottom: 10,
  },
  backdrop: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  optionItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 15,
  },
  options: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 6,
    maxHeight: 250,

    shadowColor: "#000",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    opacity: 0.8,
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,

    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    height: ITEM_HEIGHT,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
    paddingRight: 20,
  },
});
