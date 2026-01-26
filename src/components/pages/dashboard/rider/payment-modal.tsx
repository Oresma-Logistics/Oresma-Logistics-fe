"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateRideRequestInvoice } from "@/_lib/api/dashboard/rider/ride-request";
import { showToast } from "@/components/shared/toast";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideRequestId?: string;
  totalAmount?: number;
}

export function PaymentModal({
  open,
  onOpenChange,
  rideRequestId,
  totalAmount,
}: PaymentModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [canClose, setCanClose] = useState(false);

  const handleContinueToPayment = async () => {
    if (!rideRequestId || !totalAmount) {
      showToast.error(
        "Error",
        "Missing ride request ID or total amount. Please try again."
      );
      return;
    }

    setIsProcessingPayment(true);
    setCanClose(true); // Allow modal to close after clicking continue
    try {
      // Call the invoice API endpoint
      const response = await updateRideRequestInvoice(rideRequestId, totalAmount);

      if (response.success && response.authorizationUrl) {
        // Redirect to Paystack checkout immediately
        window.location.href = response.authorizationUrl;
      } else {
        showToast.error(
          "Payment Error",
          response.message || "Failed to initialize payment. Please try again."
        );
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      showToast.error(
        "Payment Error",
        error instanceof Error
          ? error.message
          : "Failed to initialize payment. Please try again."
      );
      setIsProcessingPayment(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if canClose is true (user clicked continue to payment)
    if (!newOpen && !canClose) {
      return; // Prevent closing
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent 
        className="sm:max-w-[440px] p-8 rounded-3xl"
        showCloseButton={canClose}
        onInteractOutside={(e) => {
          if (!canClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!canClose) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Choose Payment Method
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Your ride request has been created successfully. How would you like to pay?
          </p>

          <div className="w-full space-y-4">
            <Button
              onClick={handleContinueToPayment}
              disabled={isProcessingPayment || !rideRequestId || !totalAmount}
              className="w-full bg-secondaryT hover:bg-secondaryT/90 text-primary-foreground font-medium py-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Continue to Payment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
