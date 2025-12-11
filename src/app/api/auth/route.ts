import { NextResponse, NextRequest } from "next/server";
import { ApiBaseUrl } from "@/_lib/store/apiUrl";
import { cookies } from "next/headers";

type FormData = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const url = ApiBaseUrl();
  if (!url) {
    return NextResponse.json(
      { success: false, message: "Failed to register. Please try again." },
      { status: 500 }
    );
  }
  try {
    const form: FormData = await request.json();
    const login = await fetch(`${url}/auth/login`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (login.status === 200) {
      const data = await login.json();
      const Cookies = await cookies();
      Cookies.set({
        name: "token",
        value: data.token,
        httpOnly: false, // can be accessed by JS if needed
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      Cookies.set({
        name: "user",
        value: JSON.stringify(data.user), // must be string
        httpOnly: false, // can be accessed by JS if needed
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return NextResponse.json(
        {
          success: data?.success,
          message: data?.message ?? "Network Error",
          isRider: data?.user?.role === "rider" ? true : false,
        },
        { status: data.status }
      );
    } else {
      const data = await login.json();
      return NextResponse.json(
        {
          success: data.success,
          message: data.message,
        },
        {
          status: login.status,
        }
      );
    }
  } catch (error) {
    console.log("Registration error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to register. Please try again.",
        },
        { status: 500 }
      );
    }
  }
}
