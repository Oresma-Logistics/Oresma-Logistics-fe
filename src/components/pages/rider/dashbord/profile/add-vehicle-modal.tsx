"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerInput } from "@/components/utility/form/customInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMotorcyclePayload } from "@/_lib/type/motorcycle/motorcycle";
import { CreateMotorcycle } from "@/_lib/api/admin/motorcycle/create-motorcycle";
import { createVehicle } from "@/_lib/api/admin/createVehicle";
import { VehicleFormData } from "@/_lib/type/trucks/trucks";
import { showToast } from "@/components/shared/toast";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  riderId: string;
}

const motorcycleSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required"),
  make: z.string().optional(),
  vehicleModel: z.string().optional(),
  year: z.string().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  engineSize: z.string().optional(),
  transmissionType: z.string().optional(),
});

const truckSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required"),
  make: z.string().optional(),
  vehicleModel: z.string().optional(),
  year: z.string().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  truckType: z.string().optional(),
  transmissionType: z.string().optional(),
});

type MotorcycleFormData = z.infer<typeof motorcycleSchema>;
type TruckFormData = z.infer<typeof truckSchema>;

export function AddVehicleModal({
  isOpen,
  onClose,
  riderId,
}: AddVehicleModalProps) {
  const [vehicleType, setVehicleType] = useState<"motorcycle" | "truck">("motorcycle");
  const queryClient = useQueryClient();

  const motorcycleForm = useForm<MotorcycleFormData>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      licensePlate: "",
      make: "",
      vehicleModel: "",
      year: "",
      color: "",
      fuelType: undefined,
      engineSize: "",
      transmissionType: undefined,
    },
  });

  const truckForm = useForm<TruckFormData>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      licensePlate: "",
      make: "",
      vehicleModel: "",
      year: "",
      color: "",
      fuelType: undefined,
      truckType: "",
      transmissionType: undefined,
    },
  });

  const motorcycleMutation = useMutation({
    mutationFn: CreateMotorcycle,
    onSuccess: (data) => {
      showToast.success(
        "Motorcycle Added Successfully",
        data.message || "Motorcycle added successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["riderProfile"] });
      motorcycleForm.reset();
      onClose();
    },
    onError: (error) => {
      showToast.error("Failed to Add Motorcycle", error.message);
    },
  });

  const truckMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: (data) => {
      showToast.success(
        "Truck Added Successfully",
        data.message || "Truck added successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["riderProfile"] });
      truckForm.reset();
      onClose();
    },
    onError: (error) => {
      showToast.error("Failed to Add Truck", error.message);
    },
  });

  const onMotorcycleSubmit: SubmitHandler<MotorcycleFormData> = async (data) => {
    const payload: CreateMotorcyclePayload = {
      licensePlate: data.licensePlate,
      riderId: riderId,
    };

    if (data.make) payload.make = data.make;
    if (data.vehicleModel) payload.vehicleModel = data.vehicleModel;
    if (data.year && data.year.trim() !== "") {
      const yearNum = Number(data.year);
      if (!isNaN(yearNum)) payload.year = yearNum;
    }
    if (data.color) payload.color = data.color;
    if (data.fuelType) payload.fuelType = data.fuelType;
    if (data.engineSize && data.engineSize.trim() !== "") {
      const engineSizeNum = Number(data.engineSize);
      if (!isNaN(engineSizeNum)) payload.engineSize = engineSizeNum;
    }
    if (data.transmissionType) payload.transmissionType = data.transmissionType;

    await motorcycleMutation.mutateAsync(payload);
  };

  const onTruckSubmit: SubmitHandler<TruckFormData> = async (data) => {
    const payload: VehicleFormData & { riderId?: string } = {
      vehicleType: "truck",
      licensePlate: data.licensePlate,
      make: data.make || "",
      vehicleModel: data.vehicleModel || "",
      year: data.year || "",
      color: data.color || "",
      vin: "",
      fuelType: data.fuelType || "diesel",
      photos: [],
      condition: "excellent",
      truckType: data.truckType || "",
      transmissionType: data.transmissionType || "",
      dimensions: {
        length: null,
        width: null,
        height: null,
        cargoArea: null,
      },
      capacity: {
        maxWeight: null,
        maxVolume: null,
        payload: null,
      },
      features: {
        hasLiftGate: false,
        hasRefrigeration: false,
        hasGPS: false,
        hasRamp: false,
        hasCrane: false,
        hasToolbox: false,
        airConditioning: false,
        powerSteering: false,
      },
      riderId: riderId, // Include rider ID for truck assignment
    };

    await truckMutation.mutateAsync(payload);
  };

  const isPending = motorcycleMutation.isPending || truckMutation.isPending;
  const currentForm = vehicleType === "motorcycle" ? motorcycleForm : truckForm;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Vehicle</DialogTitle>
          <CardDescription>
            Add a new vehicle to your profile
          </CardDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select
              value={vehicleType}
              onValueChange={(value) => {
                setVehicleType(value as "motorcycle" | "truck");
                motorcycleForm.reset();
                truckForm.reset();
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Motorcycle Form */}
          {vehicleType === "motorcycle" && (
            <form
              onSubmit={motorcycleForm.handleSubmit(onMotorcycleSubmit)}
              className="space-y-4"
            >
              <CustomerInput
                inputname="licensePlate"
                register={motorcycleForm.register}
                type="text"
                label="License Plate *"
                placeholder="ABC123"
                error={
                  motorcycleForm.formState.errors.licensePlate
                    ? motorcycleForm.formState.errors.licensePlate.message
                    : undefined
                }
              />

              <CustomerInput
                inputname="make"
                register={motorcycleForm.register}
                type="text"
                label="Make (Optional)"
                placeholder="Honda"
              />

              <CustomerInput
                inputname="vehicleModel"
                register={motorcycleForm.register}
                type="text"
                label="Vehicle Model (Optional)"
                placeholder="CBR"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomerInput
                  inputname="year"
                  register={motorcycleForm.register}
                  type="number"
                  label="Year (Optional)"
                  placeholder="2020"
                />

                <CustomerInput
                  inputname="color"
                  register={motorcycleForm.register}
                  type="text"
                  label="Color (Optional)"
                  placeholder="Red"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type (Optional)</Label>
                  <Controller
                    name="fuelType"
                    control={motorcycleForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmissionType">Transmission Type (Optional)</Label>
                  <Controller
                    name="transmissionType"
                    control={motorcycleForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <CustomerInput
                inputname="engineSize"
                register={motorcycleForm.register}
                type="number"
                label="Engine Size (cc) (Optional)"
                placeholder="600"
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Motorcycle...
                  </>
                ) : (
                  "Add Motorcycle"
                )}
              </Button>
            </form>
          )}

          {/* Truck Form */}
          {vehicleType === "truck" && (
            <form
              onSubmit={truckForm.handleSubmit(onTruckSubmit)}
              className="space-y-4"
            >
              <CustomerInput
                inputname="licensePlate"
                register={truckForm.register}
                type="text"
                label="License Plate *"
                placeholder="ABC123"
                error={
                  truckForm.formState.errors.licensePlate
                    ? truckForm.formState.errors.licensePlate.message
                    : undefined
                }
              />

              <CustomerInput
                inputname="make"
                register={truckForm.register}
                type="text"
                label="Make (Optional)"
                placeholder="Mercedes"
              />

              <CustomerInput
                inputname="vehicleModel"
                register={truckForm.register}
                type="text"
                label="Vehicle Model (Optional)"
                placeholder="Actros"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomerInput
                  inputname="year"
                  register={truckForm.register}
                  type="number"
                  label="Year (Optional)"
                  placeholder="2020"
                />

                <CustomerInput
                  inputname="color"
                  register={truckForm.register}
                  type="text"
                  label="Color (Optional)"
                  placeholder="White"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type (Optional)</Label>
                  <Controller
                    name="fuelType"
                    control={truckForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truckType">Truck Type (Optional)</Label>
                  <Controller
                    name="truckType"
                    control={truckForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select truck type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flatbed">Flatbed</SelectItem>
                          <SelectItem value="box">Box Truck</SelectItem>
                          <SelectItem value="refrigerated">Refrigerated</SelectItem>
                          <SelectItem value="tanker">Tanker</SelectItem>
                          <SelectItem value="dump">Dump Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmissionType">Transmission Type (Optional)</Label>
                <Controller
                  name="transmissionType"
                  control={truckForm.control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Truck...
                  </>
                ) : (
                  "Add Truck"
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
