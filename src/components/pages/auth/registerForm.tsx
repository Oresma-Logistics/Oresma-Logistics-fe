"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailInput } from "@/components/utility/form/email-input";
import { PasswordInput } from "@/components/utility/form/password-input";
import { CustomerInput } from "@/components/utility/form/customInput";
import { useMutation } from "@tanstack/react-query";
import { userSignIn } from "@/_lib/api/auth/signUp";
import { showToast } from "@/components/shared/toast";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { nigerianStates } from "@/_lib/data/nigerian-states";

export function RegisterForm() {
  const navigate = useRouter();
  type FormData = z.infer<typeof formScheme>;
  const formScheme = z
    .object({
      email: z.email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
      name: z
        .string()
        .min(1, "Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
      confirmPassword: z.string().min(1, "Confirm Password is required"),
      phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(
          /^[\d\+]{1,14}$/,
          "Invalid phone number format. Include country code if possible."
        ),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: "Passwords doesn't match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      country: "Nigeria",
    },
  });

  // Ensure country is always set to Nigeria
  useEffect(() => {
    setValue("country", "Nigeria");
  }, [setValue]);

  const mutation = useMutation({
    mutationFn: userSignIn,
    onSuccess: (data) => {
      showToast.success("SignUp Successful", data.message);
      navigate.push("/auth/login");
    },
    onError: (error) => {
      showToast.error("Signup Failed", error.message);
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await mutation.mutateAsync(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-border/50 animate-fade-in-up lg:order-2">
      <CardHeader className="space-y-1">
        <Link href={"/"}>
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="w-10 h-10 relative rounded-lg flex items-center justify-center">
              <Image src={"/logo.svg"} alt="Oresema Logo" fill />
            </div>
            <span className="text-2xl font-bold text-secondaryT">Oresma</span>
          </div>
        </Link>
        <CardTitle className="text-3xl font-bold text-secondaryT text-center ">
          Create account
        </CardTitle>
        <CardDescription className="text-base text-primaryT text-center">
          Join Oresma Logistics and start shipping smarter
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <CustomerInput
            label="Full Name"
            type="text"
            inputname="name"
            placeholder="John Joe"
            register={register}
            error={errors.name ? errors.name.message : undefined}
          />
          <EmailInput
            inputname="email"
            register={register}
            label="email"
            error={errors.email ? errors.email.message : undefined}
          />
          <CustomerInput
            inputname="phone"
            register={register}
            label="Phone Number"
            placeholder="e.g. +1234567890"
            type="text"
            error={errors.phone ? errors.phone.message : undefined}
          />
          <PasswordInput
            label="Password"
            inputname="password"
            register={register}
            error={errors.password ? errors.password.message : undefined}
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

          {/* State Field */}
          <div className="space-y-2">
            <Label htmlFor="state" className="text-foreground font-medium">
              State (Optional)
            </Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="state"
                    className="h-11 w-full bg-background border-input focus:border-primary transition-colors"
                  >
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.state && (
              <div className="text-red-500 text-sm">{errors.state.message}</div>
            )}
          </div>

          {/* Country Field */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground font-medium">
              Country
            </Label>
            <input
              type="text"
              {...register("country")}
              defaultValue="Nigeria"
              disabled
              readOnly
              className="h-11 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            className="w-full h-11 bg-secondaryT hover:bg-secondaryT/90 text-primary-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <div className="text-center text-sm text-primaryT">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-secondaryT hover:text-secondaryT/80 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
