import { RiderWalletCard } from "@/components/pages/rider/dashbord/wallet/currentBalance";
import { WalletHistory } from "@/components/pages/rider/dashbord/wallet/wallet-history";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";
import { BankCard } from "@/components/pages/rider/dashbord/wallet/savedCard";
import { Suspense } from "react";

export default function RiderWalletDashboardPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/rider/dashboard" },
          { label: "Wallets" },
        ]}
      />
      <Suspense fallback={""}>
        <RiderWalletCard />
      </Suspense>
      <BankCard />
      <hr className="border-t border-[#F7F8FB] border-7" />
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-3">
          <WalletHistory />
        </div>
      </div>
    </div>
  );
}
