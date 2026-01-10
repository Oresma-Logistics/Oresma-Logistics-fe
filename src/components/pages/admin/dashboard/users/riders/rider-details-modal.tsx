"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rider } from "@/_lib/type/auth/users";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  DollarSign,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RiderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rider: Rider | null;
}

export function RiderDetailsModal({
  open,
  onOpenChange,
  rider,
}: RiderDetailsModalProps) {
  if (!rider) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge
        className={statusColors[status.toLowerCase()] || statusColors.pending}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Rider Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </h3>
            {rider.userId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{rider.userId.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium">{rider.userId.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="font-medium">{rider.userId.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email Verified</p>
                  {rider.userId.isEmailVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No user information available</p>
            )}
          </div>

          {/* Rider Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Car className="h-5 w-5" />
              Rider Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Rider ID</p>
                <p className="font-mono text-sm">{rider._id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Status</p>
                {getStatusBadge(rider.accountStatus)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Verification Status</p>
                {getStatusBadge(rider.verificationStatus)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Is Verified</p>
                {rider.isVerified ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Verified
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Is Available</p>
                {rider.isAvailable ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unavailable
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Is Vendor</p>
                {rider.isVendor ? (
                  <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">No</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5" />
              Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
                <p className="text-2xl font-bold">{rider.rating.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-gray-500">Total Deliveries</p>
                </div>
                <p className="text-2xl font-bold">{rider.totalDeliveries}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-500">Total Earnings</p>
                </div>
                <p className="text-2xl font-bold">
                  ₦{rider.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Vehicle Type</p>
              <Badge className="bg-blue-100 text-blue-800">
                {rider.vehicleInfo.vehicleType}
              </Badge>
            </div>
          </div>

          {/* Bank Details */}
          {rider.bankDetails && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-medium">{rider.bankDetails.accountNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Account Name</p>
                  <p className="font-medium">{rider.bankDetails.accountName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p className="font-medium">{rider.bankDetails.bankName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Bank Code</p>
                  <p className="font-medium">{rider.bankDetails.bankCode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Location
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Coordinates</p>
              <p className="font-mono text-sm">
                [{rider.currentLocation.coordinates[0]}, {rider.currentLocation.coordinates[1]}]
              </p>
            </div>
          </div>

          {/* Operating Hours */}
          {rider.vendorProfile.operatingHours.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </h3>
              <div className="space-y-2">
                {rider.vendorProfile.operatingHours.map((hour, index) => (
                  <p key={index} className="text-sm">{hour}</p>
                ))}
              </div>
            </div>
          )}

          {/* Verification Documents */}
          {rider.verificationDocuments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Verification Documents</h3>
              <div className="space-y-2">
                {rider.verificationDocuments.map((doc, index) => (
                  <Badge key={index} variant="outline">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-sm">{formatDate(rider.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="text-sm">{formatDate(rider.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
