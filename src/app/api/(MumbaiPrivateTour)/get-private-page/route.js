import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const urlNew = new URL(req.url);
  const params = new URLSearchParams(urlNew.search);
  const from = params.get("from") || 1;
  const to = params.get("to");

  const url = `${process.env.Get_private_Page}?from=${from}&to=${to}`;
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: {
       'x-api-key': 'IsMuTo@2026Xk9$mQ3zP!rL7vN',
    }
  });
  const data = await response.json();
  return NextResponse.json(data);
}
