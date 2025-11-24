import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import News from '@/models/News';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper: Title se URL (slug) banane ke liye
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// 1. GET: Fetch All OR Single News
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const newsItem = await News.findById(id);
      if (!newsItem) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
      return NextResponse.json({ success: true, data: newsItem });
    } else {
      // All News (Latest first)
      const news = await News.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: news });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 2. POST: Create New (🔥 WITH AUTHOR FIX)
export async function POST(request) {
  await dbConnect();
  
  try {
    // 🔥 Step 1: User ka Session nikalo
    const session = await getServerSession(authOptions);
    
    // Security: Check karo banda login hai ya nahi
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // 🔥 Step 2: Slug Auto-Generate (Agar user ne nahi bhara)
    let slug = body.slug;
    if (!slug) {
        slug = createSlug(body.title);
    }

    // Slug Check
    const existingNews = await News.findOne({ slug });
    if (existingNews) {
       // Agar duplicate hai to random number jod do
       slug = slug + "-" + Math.floor(Math.random() * 1000);
    }

    // 🔥 Step 3: Data Create karo (Author Name add karke)
    const news = await News.create({
        ...body,           // Frontend ka sara data (title, content, etc.)
        slug: slug,        // Generated slug
        author: session.user.name || "Nova Admin" // ✅ YE HAI MAIN FIX
    });

    return NextResponse.json({ success: true, data: news }, { status: 201 });

  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 3. PUT: Update Existing News
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: "ID Required" }, { status: 400 });

    // ID nikal do body se update karne se pehle
    const { _id, createdAt, updatedAt, ...updateData } = body;

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
        return NextResponse.json({ success: false, error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNews });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Delete News
export async function DELETE(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // 🔥 Security: Sirf Admin/Superadmin delete kar sake (Optional)
    const session = await getServerSession(authOptions);
    if(session?.user?.role !== 'superadmin' && session?.user?.role !== 'admin') {
        return NextResponse.json({ success: false, error: "Permission Denied" }, { status: 403 });
    }

    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    await News.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}