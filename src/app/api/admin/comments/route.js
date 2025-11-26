import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import News from "@/models/News";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ===========================
// GET ALL COMMENTS (ADMIN)
// ===========================
export async function GET() {
  try {
    await dbConnect();

    const comments = await Comment.find()
      .populate("userId", "name image")
      .populate({
        path: "postId",
        model: News,
        select: "title slug",
      })
      .sort({ createdAt: -1 });

    return Response.json({ success: true, data: comments });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ===========================
// UPDATE STATUS (APPROVE/REJECT)
// ===========================
export async function PATCH(req) {
  try {
    await dbConnect();

    const { id, status } = await req.json();

    if (!id || !status) {
      return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const updated = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ===========================
// DELETE COMMENT
// ===========================
export async function DELETE(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ success: false, error: "ID missing" }, { status: 400 });
    }

    await Comment.findByIdAndDelete(id);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
