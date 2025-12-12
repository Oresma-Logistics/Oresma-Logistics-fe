"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailInput } from "@/components/utility/form/email-input";
import { PasswordInput } from "@/components/utility/form/password-input";
import { showToast } from "@/components/shared/toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RouteLoginResponse } from "@/_lib/type/auth/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  type FormSchema = z.infer<typeof signInScheme>;
  const signInScheme = z.object({
    email: z.email(),
    password: z
      .string()
      .min(1, "Password is Required")
      .min(7, "Minimum of 8 characters"),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInScheme),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);
    try {
      const request = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (request.status !== 200) {
        const result = await request.json();
        throw new Error(result.message);
      }
      const result: RouteLoginResponse = await request.json();
      showToast.success(result.message);
      setTimeout(() => {
        if (result.isRider) {
          navigate.push("/rider/dashboard");
        } else navigate.push("/dashboard/rider");
      }, 500);
    } catch (error) {
      if (error instanceof Error) {
        showToast.error("Login Failed", error.message ?? "Network Error");
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-border/50 animate-fade-in-up">
      <CardHeader className="space-y-1">
        <Link href={"/"}>
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center relative">
              <Image src={"/logo.svg"} alt="Oresema Logo" fill />
            </div>
            <span className="text-2xl font-bold text-foreground">Oresma</span>
          </div>
        </Link>
        <CardTitle className="text-3xl font-bold text-secondaryT text-center">
          Sign in
        </CardTitle>
        <CardDescription className="text-base text-primaryT text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <EmailInput
            label="Email"
            inputname="email"
            register={register}
            error={errors.email ? errors.email.message : undefined}
          />
          <PasswordInput
            label="Passoword"
            inputname="password"
            register={register}
            error={errors.password ? errors.password.message : undefined}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4 ">
          <Button
            type="submit"
            className="w-full h-11 bg-secondaryT hover:bg-secondaryT/90 text-primary-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <div className="text-center text-sm text-primaryT">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-secondaryT hover:text-secondaryT/90 font-semibold transition-colors"
            >
              Create account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
