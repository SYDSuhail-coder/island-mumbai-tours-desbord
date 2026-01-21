import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const urlNew = new URL(req.url);
  const params = new URLSearchParams(urlNew.search);
  const from = params.get("from") || 1;
  const to = params.get("to");

  const url = `${process.env.List_Page_api}?from=${from}&to=${to}`;
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: {
        //  'x-api-key':'pIFmUW8YJw9HFk9Z4R1wA7fEbNjYc7EUaRLFopZ0'
    }
  });
  const data = await response.json();
  return NextResponse.json(data);
}
