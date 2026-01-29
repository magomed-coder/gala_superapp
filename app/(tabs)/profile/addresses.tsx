import { Button, Card, Divider, Input, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfileStore } from "../../../shared/stores";

export default function AddressesScreen() {
  const router = useRouter();
  const profile = useProfileStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", address: "" });

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address) {
      profile.addAddress({
        id: Date.now().toString(),
        name: newAddress.name,
        address: newAddress.address,
        isDefault: profile.addresses.length === 0,
      });
      setNewAddress({ name: "", address: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveAddress = (id: string) => {
    profile.removeAddress(id);
  };

  const handleSetDefault = (id: string) => {
    profile.setDefaultAddress(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backRow}
            accessibilityRole="button"
            accessibilityLabel="Назад"
          >
            <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
            <Text size="lg" color="#FF6B6B" style={{ marginLeft: 8 }}>
              Назад
            </Text>
          </TouchableOpacity>
          <Text size="xl" weight="bold" style={{ marginTop: 8 }}>
            Мои адреса
          </Text>
        </View>

        {/* Addresses List */}
        {profile.addresses.map((addr) => (
          <Card key={addr.id} style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <View style={{ flex: 1 }}>
                <Text weight="semibold" size="lg">
                  {addr.name}
                </Text>
                <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
                  {addr.address}
                </Text>
              </View>
              {addr.isDefault && (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: "#FF6B6B20",
                    borderRadius: 4,
                  }}
                >
                  <Text size="xs" color="#FF6B6B" weight="semibold">
                    По умолчанию
                  </Text>
                </View>
              )}
            </View>
            <Divider style={{ marginVertical: 12 }} />
            <View style={styles.addressActions}>
              {!addr.isDefault && (
                <TouchableOpacity
                  onPress={() => handleSetDefault(addr.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="star" size={16} color="#10B981" />
                  <Text
                    size="sm"
                    color="#10B981"
                    weight="semibold"
                    style={{ marginLeft: 8 }}
                  >
                    По умолчанию
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleRemoveAddress(addr.id)}
                style={styles.actionButton}
              >
                <Ionicons name="trash" size={16} color="#EF4444" />
                <Text
                  size="sm"
                  color="#EF4444"
                  weight="semibold"
                  style={{ marginLeft: 8 }}
                >
                  Удалить
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {/* Add Address Form */}
        {showAddForm && (
          <Card style={styles.formCard}>
            <Input
              placeholder="Название адреса"
              value={newAddress.name}
              onChangeText={(text) =>
                setNewAddress({ ...newAddress, name: text })
              }
              style={styles.input}
            />
            <Input
              placeholder="Адрес"
              value={newAddress.address}
              onChangeText={(text) =>
                setNewAddress({ ...newAddress, address: text })
              }
              style={styles.input}
            />
            <View style={styles.formButtons}>
              <Button
                label="Сохранить"
                variant="primary"
                onPress={handleAddAddress}
                style={{ flex: 1 }}
              />
              <Button
                label="Отмена"
                variant="secondary"
                onPress={() => setShowAddForm(false)}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </Card>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <View style={styles.addButtonContainer}>
            <Button
              label="+ Добавить адрес"
              variant="secondary"
              onPress={() => setShowAddForm(true)}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addressCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  addressActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: "row",
    gap: 8,
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
