import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connection try karega
    await dbConnect();
    
    // Agar connect ho gaya to ye message aayega
    return NextResponse.json({ 
      status: 'success', 
      message: 'BADHAI HO! MongoDB Atlas Connected Hai! 🚀🟢' 
    }, { status: 200 });

  } catch (error) {
    // Agar fail hua to error dikhayega
    console.error("Database Error:", error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Connection Failed 🔴', 
      error: error.message 
    }, { status: 500 });
  }
}