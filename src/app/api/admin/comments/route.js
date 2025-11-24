// Force server runtime and disable static rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import News from "@/models/News";

// GET: Fetch all comments with user + post populated
export async function GET() {
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
}

// PATCH: Update comment status
export async function PATCH(req) {
  await dbConnect();

  const { id, status } = await req.json();
  const updated = await Comment.findByIdAndUpdate(id, { status }, { new: true });

  return Response.json({ success: true, data: updated });
}

// DELETE: Remove a comment
export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await Comment.findByIdAndDelete(id);

  return Response.json({ success: true });
}
