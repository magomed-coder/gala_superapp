// Common types
export interface Address {
  id: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  zipCode: string;
  coordinates: { lat: number; lng: number };
  isDefault: boolean;
}

// Service Provider
export interface ServiceProvider {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  image: string;
  price: number;
  description: string;
  whatsappPhone?: string;
  telegramUsername?: string;
  phoneNumber: string;
}

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  providers: ServiceProvider[];
}

// Shop
export interface Shop {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: { min: number; max: number };
  minimumOrder: number;
}

// Product
export interface Product {
  id: string;
  shopId: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

// Order
export interface Order {
  id: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  totalAmount: number;
  createdAt: Date;
  estimatedDeliveryTime: Date;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  role?: "customer" | "provider" | "admin";
}

// Review
export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: Date;
}
