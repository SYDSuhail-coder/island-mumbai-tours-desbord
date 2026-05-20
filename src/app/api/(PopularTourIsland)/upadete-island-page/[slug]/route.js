import { NextResponse } from "next/server";

export async function PUT(req, context) {
    const params = await context.params;
    const { slug } = params;
    const formData = await req.formData();

    const response = await fetch(
        `${process.env.Upadete_Island_Page}/${slug}`,
        {
            method: "PUT",
            headers: {
                "x-api-key": "IsMuTo@2026Xk9$mQ3zP!rL7vN",
            },
            body: formData,
        }
    );

    const data = await response.json();
    return NextResponse.json(data);
}