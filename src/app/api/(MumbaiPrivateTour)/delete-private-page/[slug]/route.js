import { NextResponse } from "next/server";

export async function DELETE(req, context) {
    const params = await context.params;
    const { slug } = params;
    const response = await fetch(`${process.env.Delete_private_Page}/${slug}`, {
        method: "DELETE",
        headers: {
            "x-api-key": "IsMuTo@2026Xk9$mQ3zP!rL7vN",
        },
    }
    );
    const data = await response.json();
    return NextResponse.json(data);
}