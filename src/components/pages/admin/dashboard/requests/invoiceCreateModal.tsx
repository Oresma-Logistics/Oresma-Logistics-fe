"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}
// import { useState } from "react";
import { CustomerInput } from "@/components/utility/form/customInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
// import { Processing, Processnvoice } from "./processing";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { CreateInvoice } from "@/_lib/api/admin/create-invoice";
import { showToast } from "@/components/shared/toast";
import { LoadingSpinner } from "@/components/shared/loading/loadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import Link from "next/link";

export default function CreateInoiveModal({ open, onOpenChange, id }: Props) {
  type FormSchema = z.infer<typeof InvoiceCreateSchema>;
  const queryClient = useQueryClient();
  const InvoiceCreateSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    estimatedFare: z.string().min(1, "Estimated Fare is required"),
    baseFare: z.string().min(1, "Base Fare  is required"),
    distanceFare: z.string().min(1, "Distance Fare  is required"),
    timeFare: z.string().min(1, "Time Fare  is required"),
    surgeMultiplier: z.string().min(1, "Surge Multiplier  is required"),
    tax: z.string().min(1, "Tax is required"),
    serviceFee: z.string().min(1, "Service Fee is required"),
    total: z.string().min(1, "Total is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InvoiceCreateSchema),
  });

  const mutation = useMutation({
    mutationFn: CreateInvoice,
    mutationKey: ["CeateInvoice"],
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["AdminRideRequest"] });
      queryClient.invalidateQueries({ queryKey: ["Single Request", id] });
    },
    onError: (error) => {
      showToast.error("Failed to create Invoice", error.message);
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    await mutation.mutateAsync({ data: data, id: id });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={mutation.isPending ? () => {} : onOpenChange}
    >
      <DialogTitle></DialogTitle>
      {mutation.isPending && (
        <DialogContent className="p-5 py-15">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {/* <Image  /> */}
              <LoadingSpinner color="blue" size="md" />
              <h3 className="text-primaryT text-2xl font-semibold">
                Processing.......
              </h3>
            </div>
          </div>
        </DialogContent>
      )}
      {!mutation.isPending && mutation.isIdle && (
        <DialogContent className="max-h-[90%] overflow-auto">
          <h4 className="font-semibold text-xl md:text-2xl ">
            Contractor Information ({id})
          </h4>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={"currency"}
                    className="text-foreground font-medium"
                  >
                    Currency
                  </Label>
                </div>
                <select
                  {...register("currency")}
                  className="h-11 bg-transparent border border-input w-full rounded-md"
                >
                  <option value="">Select currency</option>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                </select>
                {errors.currency && (
                  <div className="text-red-500 text-sm">
                    {errors.currency.message}
                  </div>
                )}
              </div>

              <CustomerInput
                type="number"
                register={register}
                label="Estimated Fare "
                inputname="estimatedFare"
                error={
                  errors.estimatedFare
                    ? errors.estimatedFare.message
                    : undefined
                }
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Base Fare"
                inputname="baseFare"
                error={errors.baseFare ? errors.baseFare.message : undefined}
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Distance Fare"
                inputname="distanceFare"
                error={
                  errors.distanceFare ? errors.distanceFare.message : undefined
                }
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Surge Multiplier"
                inputname="surgeMultiplier"
                error={
                  errors.surgeMultiplier
                    ? errors.surgeMultiplier.message
                    : undefined
                }
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Time Fare"
                inputname="timeFare"
                error={errors.timeFare ? errors.timeFare.message : undefined}
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Tax"
                inputname="tax"
                error={errors.tax ? errors.tax.message : undefined}
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Service Feee"
                inputname="serviceFee"
                error={
                  errors.serviceFee ? errors.serviceFee.message : undefined
                }
                step="any"
              />
              <CustomerInput
                type="number"
                register={register}
                label="Total"
                inputname="total"
                error={errors.total ? errors.total.message : undefined}
                step="any"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full h-11 font-semibold mt-5 cursor-pointer"
              >
                Create Invoice
              </Button>
            </div>
          </form>
        </DialogContent>
      )}
      {!mutation.isPending && mutation.isSuccess && (
        <DialogContent className="p-5 py-15">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {/* <Image  /> */}
              <Image src={"/wallet.svg"} alt="wallet" width={96} height={96} />
              <h3 className="text-primaryT text-2xl font-semibold">Sent</h3>
            </div>
            Invoice Created
            <Button asChild className=" mt-4">
              <Link href={"/admin/dashboard/requests"}>Back to request</Link>
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
