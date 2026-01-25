import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Divider,
  Input,
  Text,
} from "../../../shared/components/ui";

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Дом",
      address: "ул. Ленина, 42, кв. 15",
      isDefault: true,
    },
    {
      id: "2",
      name: "Офис",
      address: "пр. Центральный, 100",
      isDefault: false,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", address: "" });

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address) {
      setAddresses([
        ...addresses,
        {
          id: Date.now().toString(),
          name: newAddress.name,
          address: newAddress.address,
          isDefault: false,
        },
      ]);
      setNewAddress({ name: "", address: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text size="lg" color="#FF6B6B">
              ← Назад
            </Text>
          </TouchableOpacity>
          <Text size="xl" weight="bold" style={{ marginTop: 8 }}>
            Мои адреса
          </Text>
        </View>

        {/* Addresses List */}
        {addresses.map((addr) => (
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
              <TouchableOpacity>
                <Text size="sm" color="#FF6B6B" weight="semibold">
                  Редактировать
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemoveAddress(addr.id)}>
                <Text size="sm" color="#EF4444" weight="semibold">
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
});
