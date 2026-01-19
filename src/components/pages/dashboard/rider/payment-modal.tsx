"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CreditCard, Package, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideRequestId?: string;
}

export function PaymentModal({
  open,
  onOpenChange,
  rideRequestId,
}: PaymentModalProps) {
  const router = useRouter();

  const handleContinueToPayment = () => {
    // Navigate to payment page with ride request ID
    if (rideRequestId) {
      router.push(`/dashboard/payment?rideRequestId=${rideRequestId}`);
    } else {
      router.push("/dashboard/payment");
    }
    onOpenChange(false);
  };

  const handlePayOnDelivery = () => {
    // Navigate to my requests page
    router.push("/dashboard/my-requests");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-[440px] p-8 rounded-3xl">
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
              className="w-full bg-secondaryT hover:bg-secondaryT/90 text-primary-foreground font-medium py-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Continue to Payment
            </Button>

            <Button
              onClick={handlePayOnDelivery}
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-medium py-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Pay on Delivery
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
