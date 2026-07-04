import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = token ? verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, payment_status } = body;

    // Get current record
    const currentResult = await query(
      "SELECT status, payment_status, admin_id FROM public.bookings WHERE id = $1",
      [id]
    );

    if (currentResult.rows.length === 0) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    // Get the admin's UUID to link this action to
    const adminResult = await query(
      "SELECT id FROM public.admins WHERE admin_email = $1",
      [session.email]
    );
    const adminId = adminResult.rows[0]?.id;

    // Build the dynamic update query
    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      updateFields.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (payment_status) {
      updateFields.push(`payment_status = $${paramIndex++}`);
      queryParams.push(payment_status);
      
      // Automatically record payment date if paying
      if (payment_status !== "unpaid") {
        updateFields.push(`payment_date = timezone('utc'::text, now())`);
      } else {
        updateFields.push(`payment_date = NULL`);
      }
    }

    // Associate admin if not already set
    updateFields.push(`admin_id = $${paramIndex++}`);
    queryParams.push(adminId);

    // Always update updated_at
    updateFields.push(`updated_at = timezone('utc'::text, now())`);

    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields provided to update." }, { status: 400 });
    }

    queryParams.push(id);
    const updateQuery = `
      UPDATE public.bookings 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, status, payment_status, payment_date;
    `;

    const result = await query(updateQuery, queryParams);

    return NextResponse.json({
      status: "success",
      message: "Booking updated successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating admin booking:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
