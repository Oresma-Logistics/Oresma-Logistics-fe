"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CreateWalletsPin } from "@/_lib/api/wallet/wallet-action";
import { showToast } from "@/components/shared/toast";
import { useQueryClient } from "@tanstack/react-query";

export function AddWalletPin() {
  const [pin, setPin] = useState<string | null>(null);
  const [confirmPin, setConfirmPin] = useState<string | null>(null);
  const [clickSetPin, setClickSetPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (pin: string) => CreateWalletsPin({ pin }),
    onSuccess: () => {
      showToast.success("Success", "Wallet PIN created successfully");

      queryClient.invalidateQueries({
        queryKey: ["singleRiderWallet"],
      });
    },
  });
  const handleConfirmPinClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPin || confirmPin.length !== 4) {
      setError("Please enter a valid 4-digit PIN");
      return;
    }

    if (confirmPin === pin) {
      setError(null);
      console.log("PIN set successfully:", pin);
      await mutation.mutateAsync(pin);

      setConfirmPin(null);
      setPin(null);
      setClickSetPin(false);
      // Add your logic to save the PIN here
    } else {
      setError("PINs do not match. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 min-h-screen bg-black/50 z-40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl py-0 pb-4">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-start justify-between py-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">Create Wallet Pin</CardTitle>
              <CardDescription className="text-slate-300">
                Set a 4-digit PIN to secure your wallet
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-3 flex flex-col gap-6 items-center">
            {!clickSetPin && (
              <>
                <h1 className="text-primaryT text-xl">Set your PIN</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form className="space-y-4 ">
                  <InputOTP
                    maxLength={4}
                    onChange={(value) => {
                      setPin(value);
                    }}
                    value={pin || ""}
                  >
                    <InputOTPGroup className="justify-center gap-4">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pin) {
                        if (pin && pin.length === 4) {
                          setClickSetPin(true);
                          setError(null);
                        } else {
                          setError("Please enter a valid 4-digit PIN");
                        }
                      } else {
                        setError("Please enter a valid 4-digit PIN");
                      }
                    }}
                    className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer mt-5"
                  >
                    Set Pin
                  </Button>
                  {error && <p className="text-red-500">{error}</p>}
                </form>
              </>
            )}
            {clickSetPin && pin && (
              <>
                <h1 className="text-primaryT text-xl">Confirm your PIN</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form className="space-y-4" onSubmit={handleConfirmPinClick}>
                  <InputOTP
                    maxLength={4}
                    onChange={(value) => {
                      setConfirmPin(value);
                    }}
                    value={confirmPin || ""}
                  >
                    <InputOTPGroup className="justify-center gap-4">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="flex flex-col gap-4 mt-7">
                    <Button
                      type="submit"
                      disabled={mutation.isPending || mutation.isSuccess}
                      className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      {mutation.isPending
                        ? "Creating Pin...."
                        : mutation.isSuccess
                        ? "Pin Created "
                        : "Confirm Pin"}
                    </Button>
                    <Button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        setClickSetPin(false);
                        setError(null);
                        setConfirmPin(null);
                        setPin(null);
                      }}
                      className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
