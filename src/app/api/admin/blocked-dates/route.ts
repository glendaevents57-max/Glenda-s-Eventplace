import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Fetch all blocked slots
export async function GET() {
  try {
    // Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = token ? verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const result = await query(
      "SELECT id, blocked_date, time_slot, reason FROM public.blocked_slots ORDER BY blocked_date ASC"
    );

    // Format dates to YYYY-MM-DD string
    const blockedSlots = result.rows.map(row => {
      const rawDate = row.blocked_date;
      const formattedDate = rawDate instanceof Date 
        ? rawDate.toISOString().split("T")[0] 
        : String(rawDate).split("T")[0];

      return {
        id: row.id,
        blocked_date: formattedDate,
        time_slot: row.time_slot,
        reason: row.reason,
      };
    });

    return NextResponse.json({
      status: "success",
      blockedSlots,
    });
  } catch (error) {
    console.error("Error fetching blocked slots:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// Block a new slot
export async function POST(request: Request) {
  try {
    // Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = token ? verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { blocked_date, time_slot, reason } = body;

    if (!blocked_date || !time_slot) {
      return NextResponse.json(
        { message: "Blocked date and time slot are required." },
        { status: 400 }
      );
    }

    // Insert block slot record
    const result = await query(
      `INSERT INTO public.blocked_slots (blocked_date, time_slot, reason)
       VALUES ($1, $2, $3)
       RETURNING id, blocked_date, time_slot, reason`,
      [blocked_date, time_slot, reason || ""]
    );

    const inserted = result.rows[0];
    const formattedDate = inserted.blocked_date instanceof Date 
      ? inserted.blocked_date.toISOString().split("T")[0] 
      : String(inserted.blocked_date).split("T")[0];

    return NextResponse.json({
      status: "success",
      message: "Slot blocked successfully.",
      blockedSlot: {
        id: inserted.id,
        blocked_date: formattedDate,
        time_slot: inserted.time_slot,
        reason: inserted.reason,
      },
    });
  } catch (error) {
    console.error("Error blocking slot:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// Unblock a slot
export async function DELETE(request: Request) {
  try {
    // Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = token ? verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Blocked slot ID is required for deletion." },
        { status: 400 }
      );
    }

    const result = await query(
      "DELETE FROM public.blocked_slots WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Blocked slot not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Slot unblocked successfully.",
    });
  } catch (error) {
    console.error("Error unblocking slot:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
