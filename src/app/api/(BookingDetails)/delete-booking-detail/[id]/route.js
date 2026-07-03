import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    const { id } = await params;

    const url = `${process.env.Delete_Details_Page_By_Id}/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        cache: "no-cache",
        headers: {
            "x-api-key": "IsMuTo@2026Xk9$mQ3zP!rL7vN",
        },
    });

    const data = await response.json();
    return NextResponse.json(data);
}