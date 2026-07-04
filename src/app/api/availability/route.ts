import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

function toLocalYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month"); // 1-12

    let startDate: Date;
    let endDate: Date;

    if (yearParam && monthParam) {
      const year = parseInt(yearParam, 10);
      const month = parseInt(monthParam, 10) - 1; // 0-11 in JS Date

      if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
        return NextResponse.json(
          { message: "Invalid year or month parameters." },
          { status: 400 }
        );
      }

      startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
      endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));
    } else {
      // Default to current date through next 3 months
      const today = new Date();
      startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
      endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 4, 0, 23, 59, 59));
    }

    // Query active bookings in the range
    const bookingsResult = await query(
      `SELECT id, event_date, duration_minutes, status 
       FROM public.bookings 
       WHERE status != 'cancelled' 
         AND event_date >= $1 
         AND event_date <= $2`,
      [startDate.toISOString(), endDate.toISOString()]
    );

    // Query blocked dates/slots in the range
    const blockedResult = await query(
      `SELECT blocked_date, time_slot, reason 
       FROM public.blocked_slots 
       WHERE blocked_date >= $1 
         AND blocked_date <= $2`,
      [startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]
    );

    // Format the active bookings into a simpler array
    const bookedSlots = bookingsResult.rows.map((row) => {
      const date = new Date(row.event_date);
      const dateString = toLocalYMD(date);
      const hours = date.getHours();
      
      let slot = "custom";
      if (hours === 9) slot = "morning";
      else if (hours === 14) slot = "afternoon";
      else if (hours === 19) slot = "evening";

      return {
        date: dateString,
        slot,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: row.status,
      };
    });

    // Format blocked slots
    const blockedSlots = blockedResult.rows.map((row) => {
      // Get local YYYY-MM-DD from the DB Date object safely
      const rawDate = row.blocked_date;
      const formattedDate = rawDate instanceof Date 
        ? toLocalYMD(rawDate) 
        : String(rawDate).split("T")[0];

      return {
        date: formattedDate,
        slot: row.time_slot, // 'morning', 'afternoon', 'evening', 'all_day'
        reason: row.reason,
      };
    });

    return NextResponse.json({
      startDate: toLocalYMD(startDate),
      endDate: toLocalYMD(endDate),
      bookedSlots,
      blockedSlots,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
