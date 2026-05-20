import { NextResponse } from "next/server";

export async function GET(req, context) {
    const params = await context.params;
    const { slug } = params;
    const response = await fetch(
        `${process.env.Get_By_Slug_Island_Page}/${slug}`,
        {
            method: "GET",
            headers: {
                "x-api-key": "IsMuTo@2026Xk9$mQ3zP!rL7vN",
            },
            cache: "no-store"
        }
    );

    const data = await response.json();

    return NextResponse.json(data);
}