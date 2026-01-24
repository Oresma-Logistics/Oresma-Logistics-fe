import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail } from "lucide-react";
import { RideRequest } from "@/_lib/type/request/rider-request";
import MapRoute from "./mapDisplay";
import { StatusBadge } from "../status-card";
// import

// Mock data - replace with actual API call

// const getStatusColor = (
//   status: string
// ): "default" | "secondary" | "destructive" | "outline" => {
//   switch (status) {
//     case "pending":
//       return "default";
//     case "assigned":
//       return "secondary";
//     case "in-progress":
//       return "secondary";
//     case "completed":
//       return "secondary";
//     case "cancelled":
//       return "destructive";
//     case "payment_failed":
//       return "destructive";
//     default:
//       return "outline";
//   }
// };

export default function RequestDetailWrapper({
  request,
  children,
}: {
  request: RideRequest;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              Request {request._id}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-muted-foreground">
            Reference Code:{" "}
            <span className="font-semibold">{request.referenceCode}</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Request Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-foreground font-medium">
                      {request.userId.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">
                      {request.userId.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-foreground font-medium">
                      {request.userId.phone}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Route Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 mt-1"></div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Pickup Location
                    </p>
                    <p className="text-foreground font-medium">
                      {request.pickup.address}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-border mx-3"></div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 mt-1"></div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Dropoff Location
                    </p>
                    <p className="text-foreground font-medium">
                      {request.dropoff.address}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pickup & Dropoff Contact Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Contact */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Pickup Contact
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {request.pickup.contact?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{request.pickup.contact?.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">
                        {request.pickup.contact?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropoff Contact */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Dropoff Contact
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {request.dropoff.contact?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{request.dropoff.contact?.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">
                        {request.dropoff.contact?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <MapRoute
              origin={request.pickup.address}
              destination={request.dropoff.address}
            />
            {/* Package Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Package Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <p className="text-foreground font-medium capitalize">
                    {request.vehicleType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fragile</p>
                  <p className="text-foreground font-medium">
                    {request.packageDetails.fragile ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Requires Assistance
                  </p>
                  <p className="text-foreground font-medium">
                    {request.packageDetails.requiresAssistance ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <p className="text-foreground font-medium">
                    {request.isPriority ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Pricing & Status */}
          <div className="space-y-6">
            {/* Pricing Card */}
            {request.invoiceSent && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Pricing Breakdown
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare</span>
                    <span className="text-foreground">
                      {request.pricing.currency}{" "}
                      {request.pricing.baseFare ?? ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="text-foreground">
                      {request.pricing.currency}{" "}
                      {request.pricing.distanceFare ?? ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-foreground">
                      {request.pricing.currency}{" "}
                      {request.pricing.timeFare ?? ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Surge Multiplier
                    </span>
                    <span className="text-foreground">
                      {request.pricing.surgeMultiplier}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">
                      {request.pricing.currency} {request.pricing.tax ?? ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="text-foreground">
                      {request.pricing.currency}{" "}
                      {request.pricing.serviceFee ?? ""}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-lg text-foreground">
                      {request.pricing.currency} {request.pricing.total ?? ""}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Status Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Status Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice Sent</p>
                  <p className="text-foreground font-medium">
                    {request.invoiceSent ? "✓ Yes" : "✗ No"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requires Documents</p>
                  <p className="text-foreground font-medium">
                    {request.requiresDocuments ? "✓ Yes" : "✗ No"}
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground text-xs">Created</p>
                  <p className="text-foreground text-xs">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Updated</p>
                  <p className="text-foreground text-xs">
                    {new Date(request.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
