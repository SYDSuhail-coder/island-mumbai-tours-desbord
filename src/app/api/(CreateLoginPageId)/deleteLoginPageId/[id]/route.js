import { NextResponse } from "next/server";

export async function DELETE(req, context) {
    const params = await context.params;
    const id = params.id;
    const response = await fetch(`${process.env.Delete_page_api}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  }


