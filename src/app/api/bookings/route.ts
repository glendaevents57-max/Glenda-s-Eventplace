import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { z } from "zod";

// Input validation schema
const bookingSchema = z.object({
  bookers_name: z.string().min(2, "Name must be at least 2 characters"),
  bookers_email: z.string().email("Invalid email address"),
  bookers_phone_number: z.string().min(7, "Invalid phone number"),
  event_type: z.string().min(1, "Event type is required"),
  event_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid event date format",
  }),
  duration_minutes: z.number().int().default(240),
  visitors_count: z.number().int().min(10).max(100), // Standard is 10-20, but allow buffer
  theme_name: z.string().min(1, "Theme selection is required"),
  theme_details: z.string().optional().default(""),
  custom_menu_selection: z.object({
    refreshments: z.array(z.string()),
    savory: z.array(z.string()),
    upgrades: z.array(z.string()).optional().default([]),
  }),
  is_special_request: z.boolean().default(false),
  special_request_details: z.string().optional().default(""),
  total_price: z.number().min(30000),
  downpayment_amount: z.number().min(15000),
  remaining_balance: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Auto-cancel bookings that exceeded the 2-hour payment window
    await query(
      `UPDATE public.bookings 
       SET status = 'cancelled' 
       WHERE status = 'pending' 
         AND payment_status = 'unpaid' 
         AND expected_expiry_time < NOW()`
    );

    const parsedDate = new Date(validatedData.event_date);
    
    // Adjust to local Manila time (UTC+8) to extract components
    const localDate = new Date(parsedDate.getTime() + 8 * 60 * 60 * 1000);
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(localDate.getUTCDate()).padStart(2, "0");
    const hourStr = String(localDate.getUTCHours()).padStart(2, "0");
    
    const dateString = `${year}-${month}-${day}`;
    const hours = localDate.getUTCHours();
    const localDbString = `${year}-${month}-${day} ${hourStr}:00:00`;

    // Map start hour to standard slot name
    let timeSlot = "custom";
    if (hours === 9) timeSlot = "morning";
    else if (hours === 14) timeSlot = "afternoon";
    else if (hours === 19) timeSlot = "evening";

    // 1. Check if date/slot is blocked by admin
    const blockedCheck = await query(
      `SELECT id, reason FROM public.blocked_slots 
       WHERE blocked_date = $1 AND (time_slot = $2 OR time_slot = 'all_day')`,
      [dateString, timeSlot]
    );

    if (blockedCheck.rows.length > 0) {
      return NextResponse.json(
        {
          message: `This date and slot is currently unavailable: ${blockedCheck.rows[0].reason || "Blocked by administrator."}`,
        },
        { status: 400 }
      );
    }

    // 2. Check for duplicate active bookings on the exact same date and start time
    // Exclude bookings that are cancelled
    const bookingConflictCheck = await query(
      `SELECT id FROM public.bookings 
       WHERE event_date = $1 AND status != 'cancelled'`,
      [localDbString]
    );

    if (bookingConflictCheck.rows.length > 0) {
      return NextResponse.json(
        {
          message: "This slot has already been reserved. Please pick another time or date.",
        },
        { status: 400 }
      );
    }

    // 3. Set expiry time for downpayment (e.g. 2 hours from now)
    const expectedExpiryTime = new Date();
    expectedExpiryTime.setHours(expectedExpiryTime.getHours() + 2);

    // 4. Insert the booking record
    const insertQuery = `
      INSERT INTO public.bookings (
        bookers_name, bookers_email, bookers_phone_number, event_type, 
        event_date, duration_minutes, visitors_count, status, payment_status,
        theme_name, theme_details, custom_menu_selection, is_special_request, 
        special_request_details, total_price, downpayment_amount, remaining_balance,
        expected_expiry_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, created_at, expected_expiry_time;
    `;

    const insertResult = await query(insertQuery, [
      validatedData.bookers_name,
      validatedData.bookers_email,
      validatedData.bookers_phone_number,
      validatedData.event_type,
      localDbString,
      validatedData.duration_minutes,
      validatedData.visitors_count,
      "pending",
      "unpaid",
      validatedData.theme_name,
      validatedData.theme_details,
      JSON.stringify(validatedData.custom_menu_selection),
      validatedData.is_special_request,
      validatedData.special_request_details,
      validatedData.total_price,
      validatedData.downpayment_amount,
      validatedData.remaining_balance,
      expectedExpiryTime.toISOString(),
    ]);

    const newBooking = insertResult.rows[0];

    return NextResponse.json({
      status: "success",
      message: "Booking submitted successfully! Please complete the downpayment to confirm your slot.",
      bookingId: newBooking.id,
      expiryTime: newBooking.expected_expiry_time,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
