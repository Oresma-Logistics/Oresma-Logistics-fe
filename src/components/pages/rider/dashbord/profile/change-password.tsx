"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { sendPasswordVerificationCode } from "@/_lib/api/auth/change-password";
import Cookies from "js-cookie";
import { ResetPassword } from "./reset-password-modal";

import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/components/shared/toast";
export default function RiderChangePasssword() {
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const data = Cookies.get("user");
    if (data) {
      const decryption = JSON.parse(data);
      setEmail(decryption.email);
    }
  }, []);

  const mutation = useMutation({
    mutationFn: sendPasswordVerificationCode,
    onSuccess: (data) => {
      showToast.success("Code Sent Successfully", data.message);
      setOpenModal(true);
    },
    onError: (error) => {
      showToast.error("Failed to Send Verification Code", error.message);
    },
  });

  const handleClick = async () => {
    await mutation.mutateAsync({ email: email });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground"> Change Password</h1>
        <p className="text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>
      <div>
        <Card className="max-w-2xl">
          <CardHeader>
            <h2 className="text-2xl text-primaryT font-medium">
              Change your password using the verification code sent to your
              email
            </h2>
            {/* <p className="text-sm text-muted-foreground mt-1">
              Enter the code we emailed you to securely reset your password.
            </p> */}
          </CardHeader>
          <CardContent>
            <div className="text-center space-x-6">
              <Button onClick={handleClick} disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Sending...."
                  : mutation.isSuccess
                  ? "Resend Code"
                  : "Send code"}
              </Button>
              {mutation.isSuccess && (
                <Button
                  onClick={() => {
                    setOpenModal(true);
                  }}
                  disabled={mutation.isPending}
                >
                  Reset Password
                </Button>
              )}
            </div>
          </CardContent>

          {/* <form onSubmit={handleSubmit(onSubmit)}></form> */}
          <div></div>
        </Card>
      </div>
      <ResetPassword
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}
