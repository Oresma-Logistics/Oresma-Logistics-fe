export interface UsersResponse {
  success: boolean;
  message: string;
  count: number;
  users: User[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  state?: string;
  role: "rider" | "admin" | "customer"; // role is limited to known values
  createdAt: string; // or Date if you convert it later
  updatedAt: string; // same as above
}

export interface ProfileUser {
  success: boolean;
  message: string;
  user: User;
}

import { Motorcycle } from "../motorcycle/motorcycle";

export interface RiderProfileResponse {
  success: boolean;
  message: string;
  rider: {
    vendorProfile: {
      operatingHours: string[]; // Array of operating hours (empty array in example)
    };
    vehicleInfo: {
      vehicleType: string;
    };
    bankDetails?: {
      accountNumber: string;
      accountName: string;
      bankName: string;
      bankCode: string;
    };
    currentLocation: {
      type: "Point";
      coordinates: [number, number]; // Latitude and Longitude
    };
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      isEmailVerified: boolean;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
    };
    isVendor: boolean;
    isVerified: boolean;
    verificationStatus: string;
    rating: number;
    totalDeliveries: number;
    totalEarnings: number;
    isAvailable: boolean;
    accountStatus: string;
    verificationDocuments: string[]; // Empty array in example
    motorcycles?: Motorcycle[]; // Array of motorcycles
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

export interface Rider {
  vendorProfile: {
    operatingHours: string[];
  };
  vehicleInfo: {
    vehicleType: string;
  };
  bankDetails?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
  };
  currentLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  isVendor: boolean;
  isVerified: boolean;
  verificationStatus: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  isAvailable: boolean;
  accountStatus: string;
  verificationDocuments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RidersResponse {
  success: boolean;
  message: string;
  count: number;
  riders: Rider[];
}
