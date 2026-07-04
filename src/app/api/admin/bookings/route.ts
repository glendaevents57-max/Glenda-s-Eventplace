import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = token ? verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    // 2. Fetch all bookings sorted by event_date descending
    const result = await query(
      `SELECT 
        id, admin_id, bookers_name, bookers_email, bookers_phone_number, event_type,
        event_date, duration_minutes, visitors_count, status, payment_status,
        payment_date, theme_name, theme_details, custom_menu_selection,
        is_special_request, special_request_details, total_price,
        downpayment_amount, remaining_balance, created_at
       FROM public.bookings
       ORDER BY event_date DESC`
    );

    // Format fields (numeric to float)
    const bookings = result.rows.map((row) => ({
      ...row,
      custom_menu_selection: typeof row.custom_menu_selection === 'string'
        ? JSON.parse(row.custom_menu_selection)
        : row.custom_menu_selection,
      total_price: parseFloat(row.total_price),
      downpayment_amount: parseFloat(row.downpayment_amount),
      remaining_balance: parseFloat(row.remaining_balance),
    }));

    return NextResponse.json({
      status: "success",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
