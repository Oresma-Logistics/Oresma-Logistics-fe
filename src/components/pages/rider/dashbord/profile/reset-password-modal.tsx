"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/utility/form/password-input";
import { Loader2 } from "lucide-react";

import { X } from "lucide-react";
import { CustomerInput } from "@/components/utility/form/customInput";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/_lib/api/auth/change-password";
import { showToast } from "@/components/shared/toast";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPassword({ isOpen, onClose }: Props) {
  type FormData = z.infer<typeof formScheme>;
  const navigate = useRouter();
  const formScheme = z
    .object({
      newPassword: z.string().min(1, "Password is required"),
      code: z.string().min(1, "Code is required"),
      confirmPassword: z.string().min(1, "Confirm Password is required"),
    })
    .refine((data) => data.confirmPassword === data.newPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formScheme),
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      showToast.success("Password updated successfully");
      onClose();
      navigate.push("/rider/dashboard/profile/");
    },
    onError: (error) => {
      showToast.error("Failed to update password", error.message);
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await mutation.mutateAsync(data);
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
              <CardTitle className="text-2xl">Change Your passwword</CardTitle>
              <CardDescription className="text-slate-300">
                Enter the code we emailed you to securely reset your password.
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-6">
              <CustomerInput
                inputname="code"
                register={register}
                type="text"
                label="Code"
                error={errors.code ? errors.code.message : undefined}
              />
              <PasswordInput
                label="New Password"
                inputname="newPassword"
                register={register}
                error={
                  errors.newPassword ? errors.newPassword.message : undefined
                }
              />
              <PasswordInput
                label="Confirm Password"
                inputname="confirmPassword"
                register={register}
                error={
                  errors.confirmPassword
                    ? errors.confirmPassword.message
                    : undefined
                }
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-full h-11 cursor-pointer font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password......
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              {/* <div className="text-center text-sm text-muted-foreground">
                Haven&apos;t received the code?{" "}
                <Button
                  className="font-semibold transition-colors"
                  variant="link"
                >
                  Resend
                </Button>
              </div> */}
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
