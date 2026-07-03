import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    const url = `${process.env.Update_Details_Page_By_Id}/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "x-api-key": "IsMuTo@2026Xk9$mQ3zP!rL7vN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  }