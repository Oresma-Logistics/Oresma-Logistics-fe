"use client";

import type React from "react";

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
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { riderSignUp } from "@/_lib/api/auth/riderSignUp";
import { showToast } from "@/components/shared/toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { nigerianStates } from "@/_lib/data/nigerian-states";

export function RiderSignupForm() {
  const navigate = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  type FormData = z.infer<typeof formScheme>;
  const formScheme = z.object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(7, "Password must be at least 8 characters"),
    name: z
      .string()
      .min(1, "Name is required")
      .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^[\d\+]{1,14}$/,
        "Invalid phone number format. Include country code if possible."
      ),
    state: z.string().min(1, "State is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(formScheme),
  });

  const mutation = useMutation({
    mutationFn: riderSignUp,
    onSuccess: (data) => {
      showToast.success("Rider SignUp Successful", data.message);
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
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-primaryT animate-fade-in-up lg:order-2">
      <CardHeader className="space-y-1">
        <Link href={"/"}>
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="w-10 h-10 relative rounded-lg flex items-center justify-center">
              <Image src={"/logo.svg"} alt="Oresema Logo" fill />
            </div>
            <span className="text-2xl font-bold text-white">Oresma</span>
          </div>
        </Link>
        <CardTitle className="text-3xl font-bold text-white text-center ">
          Become a Rider
        </CardTitle>
        <CardDescription className="text-base text-white/90 text-center">
          Join Oresma Logistics as a delivery rider and start earning
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-white">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className="h-11 w-full px-3 rounded-md bg-white/95 border border-white/20 focus:border-[#F75720] focus:ring-2 focus:ring-[#F75720]/20 text-foreground transition-colors"
            />
            {errors.name && (
              <div className="text-red-300 text-sm">{errors.name.message}</div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className="h-11 w-full px-3 rounded-md bg-white/95 border border-white/20 focus:border-[#F75720] focus:ring-2 focus:ring-[#F75720]/20 text-foreground transition-colors"
            />
            {errors.email && (
              <div className="text-red-300 text-sm">{errors.email.message}</div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-white">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              placeholder="e.g. 8087488566"
              {...register("phone")}
              className="h-11 w-full px-3 rounded-md bg-white/95 border border-white/20 focus:border-[#F75720] focus:ring-2 focus:ring-[#F75720]/20 text-foreground transition-colors"
            />
            {errors.phone && (
              <div className="text-red-300 text-sm">{errors.phone.message}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-white">
              State
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
                    className="h-11 w-full bg-white/95 border border-white/20 focus:border-[#F75720] focus:ring-2 focus:ring-[#F75720]/20 text-foreground transition-colors"
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
              <div className="text-red-300 text-sm">{errors.state.message}</div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                {...register("password")}
                className="h-11 w-full px-3 pr-10 rounded-md bg-white/95 border border-white/20 focus:border-[#F75720] focus:ring-2 focus:ring-[#F75720]/20 text-foreground transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-300 text-sm">{errors.password.message}</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            className="w-full h-11 bg-[#F75720] hover:bg-[#F75720]/90 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] rounded-tl-3xl rounded-br-3xl"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create rider account"
            )}
          </Button>
          <div className="text-center text-sm text-white/90">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-white hover:text-white/80 font-semibold transition-colors underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

