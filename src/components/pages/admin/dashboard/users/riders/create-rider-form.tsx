"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { X } from "lucide-react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailInput } from "@/components/utility/form/email-input";
import { PasswordInput } from "@/components/utility/form/password-input";
import { CustomerInput } from "@/components/utility/form/customInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRiderPayload } from "@/_lib/type/auth";
import { CreateRider } from "@/_lib/api/admin/rider/create-rider";
import { showToast } from "@/components/shared/toast";
import { nigerianStates } from "@/_lib/data/nigerian-states";

interface RiderSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RiderSignupModal({
  isOpen,
  onClose,
}: RiderSignupModalProps) {
  const queryClient = useQueryClient();
  const signUpScheme = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
    email: z.email(),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^[\d\+]{1,14}$/,
        "Invalid phone number format. Include country code if possible."
      ),
    password: z
      .string()
      .min(1, "Password is Required")
      .min(7, "Minimum of 8 characters"),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    isVendor: z.boolean(),
    state: z.string().optional(),
  });

  type RiderFormData = z.infer<typeof signUpScheme>;

  const form = useForm<RiderFormData>({
    resolver: zodResolver(signUpScheme),
    defaultValues: {
      vehicleType: "motorcycle",
      isVendor: false,
    },
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = form;

  const mutation = useMutation({
    mutationFn: CreateRider,
    onSuccess: (data) => {
      showToast.success("Rider Registered Successful", data.message || "Rider created successfully");
      queryClient.invalidateQueries({ queryKey: ["AllRiders"] });
      onClose();
    },
    onError: (error) => {
      showToast.error("Registration Failed", error.message);
    },
  });
  
  const onSubmit = async (data: RiderFormData) => {
    await mutation.mutateAsync(data as CreateRiderPayload);
  };
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 min-h-screen bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl py-0 pb-4">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-start justify-between py-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">Create Rider Account</CardTitle>
              <CardDescription className="text-slate-300">
                Register your rider profile with Oresma Logistics
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <CustomerInput
                inputname={"name"}
                register={register}
                type="text"
                label="Full Name"
                placeholder="John Doe"
                error={errors.name ? errors.name.message : undefined}
              />

              {/* Email Field */}
              <EmailInput
                inputname="email"
                register={register}
                error={errors.email ? errors.email.message : undefined}
                label="Email"
                placeholder="john301@gmail.com"
              />

              {/* Phone Number Field */}
              <CustomerInput
                label="Phone Number"
                inputname="phone"
                type={"text"}
                placeholder="8087488566"
                register={register}
                error={errors.phone ? errors.phone.message : undefined}
              />

              {/* Password Field */}
              <div className="space-y-2">
                <PasswordInput
                  inputname="password"
                  register={register}
                  label="Password"
                  error={
                    errors.password ? errors.password.message : undefined
                  }
                />
              </div>

              {/* Vehicle Type Field */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Controller
                  name="vehicleType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.vehicleType && (
                  <p className="text-sm text-red-500">
                    {errors.vehicleType.message}
                  </p>
                )}
              </div>

              {/* State Field */}
              <div className="space-y-2">
                <Label htmlFor="state">State (Optional)</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* Is Vendor Field */}
              <div className="flex items-center space-x-2">
                <Controller
                  name="isVendor"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isVendor"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="isVendor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Is Vendor
                </Label>
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer"
              >
                {mutation.isPending
                  ? "Creating Account..."
                  : "Create Rider Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
