export type SignUp = {
  password: string;
  phone: string;
  name: string;
  email: string;
  state?: string;
  country?: string;
};

export type CreateRiderPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
  isVendor: boolean;
  state?: string;
};
