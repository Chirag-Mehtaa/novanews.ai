import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ===========================
// GET APPROVED COMMENTS
// ===========================
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const postId = params.postId;

    const comments = await Comment.find({
      postId: new mongoose.Types.ObjectId(postId),
      status: "Approved",
    })
      .populate("userId", "name image")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, data: comments });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ===========================
// POST NEW COMMENT
// ===========================
export async function POST(req, { params }) {
  try {
    await dbConnect();

    const postId = params.postId;
    const body = await req.json();
    const { text, userId } = body;

    if (!text || !userId) {
      return Response.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const saved = await Comment.create({
      postId: new mongoose.Types.ObjectId(postId),
      userId: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      status: "Pending",
    });

    return Response.json({ success: true, data: saved });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
