"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerInput } from "@/components/utility/form/customInput";
import { EmailInput } from "@/components/utility/form/email-input";
import { PlacesAutocompleteInput } from "@/components/utility/form/places-autocomplete-input";
import { Loader2, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/components/shared/toast";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { createRideRequest } from "@/_lib/api/dashboard/rider/ride-request";
import { PaymentModal } from "./payment-modal";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  // Pickup and Dropoff Locations
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().min(1, "Dropoff location is required"),

  // Sender Information
  senderName: z
    .string()
    .min(1, "Sender name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
  senderEmail: z.string().email("Invalid email address"),
  senderPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\+]{1,14}$/,
      "Invalid phone number format. Include country code if possible."
    ),

  // Receiver Information
  receiverName: z
    .string()
    .min(1, "Receiver name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
  receiverEmail: z.string().email("Invalid email address"),
  receiverPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\+]{1,14}$/,
      "Invalid phone number format. Include country code if possible."
    ),
});

type FormData = z.infer<typeof formSchema>;

export function ShipmentDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverId = searchParams.get("driverId");
  const vehicleType = searchParams.get("vehicleType") || "motorcycle";
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [rideRequestId, setRideRequestId] = useState<string | undefined>();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const createRequestMutation = useMutation({
    mutationFn: createRideRequest,
    onSuccess: (data) => {
      if (data.success && data.rideRequest) {
        setRideRequestId(data.rideRequest._id);
        setShowPaymentModal(true);
        showToast.success(
          "Ride Request Created",
          data.message || "Your ride request has been created successfully"
        );
      } else {
        showToast.error(
          "Error",
          data.message || "Failed to create ride request"
        );
      }
    },
    onError: (error: Error) => {
      showToast.error(
        "Error",
        error.message || "Failed to create ride request. Please try again."
      );
    },
  });

  // Load pickup and dropoff locations from cookies
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrigin = Cookies.get("routeOrigin");
      const savedDestination = Cookies.get("routeDestination");
      
      if (savedOrigin) {
        setValue("pickupLocation", savedOrigin);
      }
      if (savedDestination) {
        setValue("dropoffLocation", savedDestination);
      }
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Transform form data to match API payload structure
      const payload = {
        pickup: {
          address: data.pickupLocation,
          contact: {
            name: data.senderName,
            phone: data.senderPhone,
            email: data.senderEmail,
          },
        },
        dropoff: {
          address: data.dropoffLocation,
          contact: {
            name: data.receiverName,
            phone: data.receiverPhone,
            email: data.receiverEmail,
          },
        },
        vehicleType: vehicleType.toLowerCase(), // Ensure lowercase (motorcycle, car, truck)
        pricing: {
          currency: "NGN",
          total: 1500, // TODO: Calculate actual price based on distance/route
        },
      };

      // Update cookies with the latest locations
      Cookies.set("routeOrigin", data.pickupLocation, { expires: 1 / 24 });
      Cookies.set("routeDestination", data.dropoffLocation, { expires: 1 / 24 });

      // Call the API
      await createRequestMutation.mutateAsync(payload);
    } catch (error) {
      // Error is handled by mutation's onError callback
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto space-y-6 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Rider Requests", href: "/dashboard/rider" },
          { label: "Shipment Details" },
        ]}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-secondaryT">
            Shipment Details
          </CardTitle>
          <CardDescription>
            Please provide sender and receiver information for your shipment
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {/* Pickup and Dropoff Locations Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Route Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlacesAutocompleteInput
                  label="Pickup Location"
                  inputname="pickupLocation"
                  placeholder="Enter pickup address"
                  register={register}
                  setValue={setValue}
                  error={
                    errors.pickupLocation
                      ? errors.pickupLocation.message
                      : undefined
                  }
                />
                <PlacesAutocompleteInput
                  label="Dropoff Location"
                  inputname="dropoffLocation"
                  placeholder="Enter dropoff address"
                  register={register}
                  setValue={setValue}
                  error={
                    errors.dropoffLocation
                      ? errors.dropoffLocation.message
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Sender Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Sender Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomerInput
                  label="Sender Name"
                  type="text"
                  inputname="senderName"
                  placeholder="John Doe"
                  register={register}
                  error={errors.senderName ? errors.senderName.message : undefined}
                />
                <EmailInput
                  inputname="senderEmail"
                  register={register}
                  label="Sender Email"
                  placeholder="sender@example.com"
                  error={errors.senderEmail ? errors.senderEmail.message : undefined}
                />
                <CustomerInput
                  label="Sender Phone"
                  type="text"
                  inputname="senderPhone"
                  placeholder="+1234567890"
                  register={register}
                  error={errors.senderPhone ? errors.senderPhone.message : undefined}
                />
              </div>
            </div>

            {/* Receiver Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Receiver Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomerInput
                  label="Receiver Name"
                  type="text"
                  inputname="receiverName"
                  placeholder="Jane Smith"
                  register={register}
                  error={
                    errors.receiverName ? errors.receiverName.message : undefined
                  }
                />
                <EmailInput
                  inputname="receiverEmail"
                  register={register}
                  label="Receiver Email"
                  placeholder="receiver@example.com"
                  error={
                    errors.receiverEmail
                      ? errors.receiverEmail.message
                      : undefined
                  }
                />
                <CustomerInput
                  label="Receiver Phone"
                  type="text"
                  inputname="receiverPhone"
                  placeholder="+1234567890"
                  register={register}
                  error={
                    errors.receiverPhone
                      ? errors.receiverPhone.message
                      : undefined
                  }
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-6 justify-end pt-8 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRequestMutation.isPending}
              className="px-6 bg-secondaryT hover:bg-secondaryT/90 text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createRequestMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                "Submit Shipment Details"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        rideRequestId={rideRequestId}
      />
    </div>
  );
}
