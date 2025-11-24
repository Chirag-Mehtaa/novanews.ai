import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import News from "@/models/News"; // Aapka news model

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  // 1. Check Login
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. 🔥 SECURITY CHECK: Editor ko Delete karne se roko
  if (session.user.role === 'editor') {
    return NextResponse.json(
      { message: "Access Denied: Editors cannot delete news." }, 
      { status: 403 }
    );
  }

  // 3. Agar Admin/SuperAdmin hai to Delete karne do
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    await dbConnect();
    await News.findByIdAndDelete(id); // News delete logic

    return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting news" }, { status: 500 });
  }
}