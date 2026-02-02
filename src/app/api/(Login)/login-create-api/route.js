import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
    const formData = await req.formData();
    // console.log("formData:", Object.fromEntries(formData))
    const response = await fetch(`${process.env.Login_Create_Api}`, {
        method: 'POST',
        headers: {
            // 'x-api-key': 'pIFmUW8YJw9HFk9Z4R1wA7fEbNjYc7EUaRLFopZ0',

        },
        body: formData,
    });

    const data = await response.json();
    // console.log("response data",data);
    
    return NextResponse.json(data)
}
