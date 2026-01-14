export interface CreateMotorcyclePayload {
  licensePlate: string; // Required
  riderId?: string; // Optional
  make?: string; // Optional
  vehicleModel?: string; // Optional
  year?: number; // Optional
  color?: string; // Optional
  fuelType?: string; // Optional
  engineSize?: number; // Optional
  transmissionType?: string; // Optional
}

export interface MotorcycleFeatures {
  hasGPS: boolean;
  hasStorageBox: boolean;
  hasPhoneMount: boolean;
  hasHelmet: boolean;
  other: string[];
}

export interface MotorcycleMaintenance {
  mileage: number;
  serviceHistory: unknown[];
}

export interface Motorcycle {
  _id: string;
  riderId: string | null;
  licensePlate: string;
  make?: string;
  vehicleModel?: string;
  year?: number;
  color?: string;
  fuelType?: string;
  engineSize?: number;
  transmissionType?: string;
  features: MotorcycleFeatures;
  maintenance: MotorcycleMaintenance;
  photos: string[];
  documents: string[];
  isAvailable: boolean;
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  totalTrips: number;
  totalDistance: number;
  totalRevenue: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MotorcycleResponse {
  success: boolean;
  message: string;
  motorcycle: Motorcycle;
}

export interface MotorcyclesResponse {
  success: boolean;
  message: string;
  count: number;
  motorcycles: Motorcycle[];
}
