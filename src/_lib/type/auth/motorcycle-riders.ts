export interface MotorcycleRiderUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RiderProfile {
  vendorProfile: {
    operatingHours: string[];
  };
  vehicleInfo: {
    vehicleType: string;
  };
  currentLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  _id: string;
  userId: MotorcycleRiderUser;
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

export interface MotorcycleDetails {
  id: string;
  licensePlate: string;
  features: {
    hasGPS: boolean;
    hasStorageBox: boolean;
    hasPhoneMount: boolean;
    hasHelmet: boolean;
    other: string[];
  };
  isAvailable: boolean;
  verificationStatus: string;
  totalTrips: number;
  totalDistance: number;
  totalRevenue: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MotorcycleRiderWithDetails {
  rider: RiderProfile;
  motorcycle: MotorcycleDetails;
}

export interface MotorcycleRidersResponse {
  success: boolean;
  message: string;
  count: number;
  riders: MotorcycleRiderWithDetails[];
}
