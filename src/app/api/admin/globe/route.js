import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GlobeFeed from '@/models/GlobeFeed';

// 1. POST: Naya Globe Feed Add karne ke liye
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Image URL aur Location data frontend se aa raha hai
    const newFeed = await GlobeFeed.create(body);
    
    return NextResponse.json({ success: true, data: newFeed }, { status: 201 });
  } catch (error) {
    console.error("Globe Feed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. GET: Globe par dikhane ke liye data fetch karna
export async function GET() {
  try {
    await dbConnect();
    const feeds = await GlobeFeed.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: feeds });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}