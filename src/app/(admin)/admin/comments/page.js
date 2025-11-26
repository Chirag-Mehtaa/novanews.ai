"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
  ArrowRight,
  Clock,
  User,
  Shield,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CommentsPage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================
  // FETCH ALL COMMENTS (ADMIN)
  // ======================================
  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/comments", { cache: "no-store" });

      const data = await res.json();

      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ======================================
  // UPDATE COMMENT STATUS (APPROVE / REJECT)
  // ======================================
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }), // **IMPORTANT FIX**
      });

      const data = await res.json();

      if (data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, status: newStatus } : c
          )
        );
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (error) {
      alert("Failed to update comment");
    }
  };

  // ======================================
  // DELETE COMMENT
  // ======================================
  const handleDelete = async (id) => {
    if (!confirm("Delete this comment permanently?")) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      alert("Error deleting comment");
    }
  };

  // LOADING SCREEN
  if (loading)
    return (
      <div className="p-12 flex justify-center text-indigo-600">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Moderation Queue
      </h1>

      <div className="grid gap-4">
        {comments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
            No comments currently awaiting moderation!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4"
            >
              <div className="flex gap-4">
                <div className="mt-1 p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <MessageSquare size={20} />
                </div>

                {/* COMMENT DETAILS */}
                <div>
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      {comment.userId?.name || "Guest User"}
                      {comment.userId?.role === "admin" && (
                        <Shield size={14} className="text-indigo-500" />
                      )}
                    </span>

                    {/* STATUS BADGE */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        comment.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : comment.status === "Rejected"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>

                  {/* COMMENT TEXT */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    "{comment.text}"
                  </p>

                  {/* ARTICLE LINK */}
                  {comment.postId ? (
                    <Link
                      href={`/news/${comment.postId.slug}`}
                      target="_blank"
                      className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      On Article: {comment.postId.title}
                      <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <p className="text-xs text-red-500 italic">
                      Article not found (postId missing)
                    </p>
                  )}

                  <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} />{" "}
                    {new Date(comment.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 self-end md:self-center">
                {comment.status !== "Approved" && (
                  <button
                    onClick={() => handleStatusUpdate(comment._id, "Approved")}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 rounded-lg transition-all"
                    title="Approve"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}

                <button
                  onClick={() => handleStatusUpdate(comment._id, "Rejected")}
                  className="p-2 text-amber-600 hover:bg-amber-50 border border-amber-100 rounded-lg transition-all"
                  title="Reject"
                >
                  <XCircle size={20} />
                </button>

                <button
                  onClick={() => handleDelete(comment._id)}
                  className="p-2 text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
