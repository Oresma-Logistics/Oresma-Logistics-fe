"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { CustomerInput } from "@/components/utility/form/customInput";
import z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RiderProfileResponse } from "@/_lib/type/auth/users";
import { getRiderProfile } from "@/_lib/api/rider/rider";
import SkeletonCard from "@/components/shared/skeleton/single-card-skeleton";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { UpdateProfile } from "@/_lib/api/auth/profile";
import { showToast } from "@/components/shared/toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
export function EditComponent() {
  const {
    data: riderProfileData,
    isPending,
    error: Error,
  } = useQuery<RiderProfileResponse>({
    queryKey: ["riderProfile"],
    queryFn: getRiderProfile,
  });
  const queryClient = useQueryClient();
  type FormData = z.infer<typeof formScheme>;
  const formScheme = z.object({
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
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formScheme),
  });

  const mutation = useMutation({
    mutationFn: UpdateProfile,
    onSuccess: (data) => {
      showToast.success("SignUp Successful", data.message);
      queryClient.invalidateQueries({
        queryKey: ["riderProfile"],
      });
    },
    onError: (error) => {
      showToast.error("Signup Failed", error.message);
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await mutation.mutateAsync(data);
  };

  useEffect(() => {
    if (riderProfileData) {
      reset({
        name: riderProfileData.rider.userId.name,
        phone: riderProfileData.rider.userId.phone,
      });
    }
  }, [riderProfileData, reset]);

  if (isPending) {
    return <SkeletonCard />;
  }

  if (!isPending && Error) {
    return <div className="text-red-500">{Error.message}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground"> Edit Profile</h1>
        <p className="text-muted-foreground">
          Manage and update your personal information and settings
        </p>
      </div>
      <div>
        <Card className="max-w-2xl">
          <CardHeader>
            <h2 className="text-2xl text-primaryT font-medium">
              Update Profile Form
            </h2>
            <p>Update your profile information</p>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 max-w-2xl">
              <CustomerInput
                inputname="name"
                type="text"
                label="Rider Name"
                placeholder="John Joe"
                register={register}
                error={errors.name ? errors.name.message : undefined}
              />
              <CustomerInput
                inputname="phone"
                type="text"
                label="Rider Phone Number"
                placeholder="e.g. +1234567890"
                register={register}
                error={errors.phone ? errors.phone.message : undefined}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-full h-11 cursor-pointer text-primary-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Profile....
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Link
                  href="/rider/dashboard/profile/edit/password"
                  className="text-primaryT hover:text-primaryT/80 font-semibold transition-colors"
                >
                  Change Password
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
