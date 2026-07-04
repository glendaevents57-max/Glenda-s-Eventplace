import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Retrieve details for the requested booking ID
    const result = await query(
      `SELECT 
        id, bookers_name, bookers_email, bookers_phone_number, event_type,
        event_date, duration_minutes, visitors_count, status, payment_status,
        payment_date, theme_name, theme_details, custom_menu_selection,
        is_special_request, special_request_details, total_price,
        downpayment_amount, remaining_balance, created_at, expected_expiry_time
       FROM public.bookings
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Booking reservation not found." },
        { status: 404 }
      );
    }

    const booking = result.rows[0];

    return NextResponse.json({
      status: "success",
      booking: {
        id: booking.id,
        bookers_name: booking.bookers_name,
        bookers_email: booking.bookers_email,
        bookers_phone_number: booking.bookers_phone_number,
        event_type: booking.event_type,
        event_date: booking.event_date,
        duration_minutes: booking.duration_minutes,
        visitors_count: booking.visitors_count,
        status: booking.status,
        payment_status: booking.payment_status,
        payment_date: booking.payment_date,
        theme_name: booking.theme_name,
        theme_details: booking.theme_details,
        custom_menu_selection: typeof booking.custom_menu_selection === 'string'
          ? JSON.parse(booking.custom_menu_selection)
          : booking.custom_menu_selection,
        is_special_request: booking.is_special_request,
        special_request_details: booking.special_request_details,
        total_price: parseFloat(booking.total_price),
        downpayment_amount: parseFloat(booking.downpayment_amount),
        remaining_balance: parseFloat(booking.remaining_balance),
        created_at: booking.created_at,
        expected_expiry_time: booking.expected_expiry_time,
      },
    });
  } catch (error) {
    console.error("Error retrieving booking details:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
