import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData();
    const response = await fetch(process.env.Create_Island_Page, {
        method: "POST",
        headers: {
            'x-api-key': 'IsMuTo@2026Xk9$mQ3zP!rL7vN',
        },
        body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
}