import { create } from "zustand";
import { Address } from "../../../shared/types";

interface ProfileState {
  addresses: Address[];
  favoriteShops: string[];
  favoriteServices: string[];
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  toggleFavoriteShop: (shopId: string) => void;
  toggleFavoriteService: (serviceId: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  addresses: [],
  favoriteShops: [],
  favoriteServices: [],

  addAddress: (address) =>
    set((state) => ({
      addresses: [...state.addresses, address],
    })),

  removeAddress: (addressId) =>
    set((state) => ({
      addresses: state.addresses.filter((addr) => addr.id !== addressId),
    })),

  setDefaultAddress: (addressId) =>
    set((state) => ({
      addresses: state.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      })),
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
