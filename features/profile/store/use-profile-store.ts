import { create } from "zustand";
import type { ProfileAddress } from "@/features/profile/types/profile-address";

interface ProfileState {
  addresses: ProfileAddress[];
  favoriteShops: string[];
  favoriteServices: string[];
  addAddress: (address: ProfileAddress) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  toggleFavoriteShop: (shopId: string) => void;
  toggleFavoriteService: (serviceId: string) => void;
}

/** Владеет локальными адресами и избранным; список адресов имеет один основной адрес. */
export const useProfileStore = create<ProfileState>((set) => ({
  addresses: [],
  favoriteShops: [],
  favoriteServices: [],

  addAddress: (address) =>
    set((state) => ({
      addresses: [
        ...state.addresses.map((item) =>
          address.isDefault ? { ...item, isDefault: false } : item,
        ),
        {
          ...address,
          isDefault: address.isDefault || state.addresses.length === 0,
        },
      ],
    })),

  removeAddress: (addressId) =>
    set((state) => {
      const addresses = state.addresses.filter((addr) => addr.id !== addressId);
      if (addresses.length && !addresses.some((addr) => addr.isDefault)) {
        addresses[0] = { ...addresses[0], isDefault: true };
      }
      return { addresses };
    }),

  setDefaultAddress: (addressId) =>
    set((state) => ({
      addresses: state.addresses.some((addr) => addr.id === addressId)
        ? state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          }))
        : state.addresses,
    })),

  toggleFavoriteShop: (shopId) =>
    set((state) => ({
      favoriteShops: state.favoriteShops.includes(shopId)
        ? state.favoriteShops.filter((id) => id !== shopId)
        : [...state.favoriteShops, shopId],
    })),

  toggleFavoriteService: (serviceId) =>
    set((state) => ({
      favoriteServices: state.favoriteServices.includes(serviceId)
        ? state.favoriteServices.filter((id) => id !== serviceId)
        : [...state.favoriteServices, serviceId],
    })),
}));
