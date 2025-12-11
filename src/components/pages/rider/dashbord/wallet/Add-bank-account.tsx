"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CustomerInput } from "@/components/utility/form/customInput";
import { useMutation } from "@tanstack/react-query";
// import { Input } from "@/components/ui/input";
import { BankSelector } from "@/components/shared/dashboard/bank-seletor";
import { useState } from "react";
import { BankDetails } from "@/_lib/type/wallets/wallet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
interface AddBankProps {
  isOpen: boolean;
  onClose: () => void;
}
import { AddBankAccountService } from "@/_lib/api/wallet/bank";
import { showToast } from "@/components/shared/toast";

export function AddBankAccount({ isOpen, onClose }: AddBankProps) {
  const [selectedBank, setSelectedBank] = useState<null | string>(null);
  const [bankCode, setBankCode] = useState<null | string>(null);
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  type FormData = z.infer<typeof signUpScheme>;
  const signUpScheme = z.object({
    accountNumber: z
      .string()
      .min(1, "Account Number is required")
      .regex(
        /^[0-9]{10}$/,
        "Account Number should only contain digits and be 10 digits long"
      ),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpScheme),
  });

  const mutation = useMutation({
    mutationFn: (data: BankDetails) => AddBankAccountService(data),
    onSuccess: (data) => {
      showToast.success("Bank account added successfully", data.message);
      onClose();
      queryClient.invalidateQueries({ queryKey: ["riderProfile"] });
    },
    onError: (error) => {
      showToast.error("Error adding bank account", error.message);
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (selectedBank && bankCode) {
      const bankData: BankDetails = {
        accountNumber: data.accountNumber,
        bankCode: bankCode,
        bankName: selectedBank,
      };
      setSelectedError(null);
      await mutation.mutateAsync(bankData);
    } else {
      setSelectedError("Please select a bank");
      return;
    }
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
              <CardTitle className="text-2xl">Add New Bank Account</CardTitle>
              <CardDescription className="text-slate-300">
                Add new Bank Account to your Wallet
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
              <div>
                <BankSelector
                  onSelect={(bank) => {
                    setSelectedBank(bank.name);
                    setBankCode(bank.code);
                  }}
                />
                {selectedError && (
                  <p className="text-red-500 text-sm mt-1">{selectedError}</p>
                )}
              </div>

              {/* Email Field */}

              <CustomerInput
                type="text"
                placeholder="Account Number"
                register={register}
                label="Account Number"
                inputname="accountNumber"
                error={
                  errors.accountNumber
                    ? errors.accountNumber.message
                    : undefined
                }
              />

              {/* Phone Number Field */}

              {/* Password Field */}
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer"
              >
                {mutation.isPending ? "Adding..." : "Add Bank Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
