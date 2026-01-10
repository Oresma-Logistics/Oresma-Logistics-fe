export interface MotorcycleRider {
  id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  vehicleInfo: {
    vehicleType: string;
  };
  isVendor: boolean;
  accountStatus: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface MotorcycleRidersResponse {
  success: boolean;
  message: string;
  count: number;
  riders: MotorcycleRider[];
}
