import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, signSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Login Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = authSchema.parse(body);

    // Look up administrator by email
    const result = await query(
      "SELECT id, admin_name, admin_email, password_hash FROM public.admins WHERE admin_email = $1",
      [validatedData.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    // Verify password
    const isPasswordValid = verifyPassword(validatedData.password, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Sign session token
    const token = signSession(admin.admin_email);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 Hours
    });

    return NextResponse.json({
      status: "success",
      message: "Logged in successfully.",
      admin: {
        name: admin.admin_name,
        email: admin.admin_email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Admin Auth Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// Logout Handler
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin_session",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return NextResponse.json({
      status: "success",
      message: "Logged out successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
