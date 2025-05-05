import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Portfolio data fetched successfully!' });
}

//signup
export async function POST(request) {
    const body = await request.json();
    return NextResponse.json({ message: 'Portfolio created successfully!', data: body });
}

//signin
export async function GET(request){
    const body= await request.json();
    console.log(body)
    return NextResponse.json({ message: 'Portfolio created successfully!', data: body });
}