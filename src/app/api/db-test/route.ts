import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query("SELECT NOW() as now");
    return NextResponse.json({
      status: "success",
      message: "Database connection successful!",
      timestamp: result.rows[0].now,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Database connection test error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: err.message || "Failed to connect to the database",
      },
      { status: 500 }
    );
  }
}
