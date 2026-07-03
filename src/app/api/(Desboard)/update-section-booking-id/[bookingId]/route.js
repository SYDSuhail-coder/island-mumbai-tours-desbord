import { NextResponse } from "next/server";

export async function PUT(req, context) {
    const { bookingId } = await context.params;
    const body = await req.json();
    const response = await fetch(`${process.env.Update_Booking_Section_Booking_Id}/${bookingId}`,
        {
            method: "PUT",
            headers: {
                "x-api-key": "IsMuTo@2026Xk9$mQ3zP!rL7vN",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    const data = await response.json();
    return NextResponse.json(data);
}