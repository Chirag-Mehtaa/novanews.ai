"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, Loader2, ArrowRight, Clock, User, Shield, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CommentsPage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments');

      if (!res.ok) {
        console.error("Failed to fetch comments:", res.statusText);
        return;
      }

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

  useEffect(() => { fetchComments(); }, []);

  // Update Status (Approve/Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: id, status: newStatus })
      });

      const data = await res.json();

      if (data.success) {
        setComments(comments.map(c => c._id === id ? { ...c, status: newStatus } : c));
      } else {
        alert("Failed to update: " + (data.message || "Unknown error"));
      }
    } catch (error) { 
      alert("Failed to update status"); 
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setComments(comments.filter(c => c._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  if (loading) return (
    <div className="p-12 flex justify-center text-indigo-600">
      <Loader2 size={40} className="animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Moderation Queue</h1>

      <div className="grid gap-4">
        {comments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
            No comments currently awaiting moderation!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="mt-1 p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <MessageSquare size={20} />
                </div>

                {/* Comment Details */}
                <div>
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      {comment.userId?.name || 'Guest User'}
                      {comment.userId?.role === 'admin' && (
                        <Shield size={14} className="text-indigo-500" title="Admin" />
                      )}
                    </span>

                    {/* Status Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      comment.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : comment.status === 'Rejected'
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {comment.status}
                    </span>
                  </div>

                  {/* FIXED COMMENT TEXT */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    "{comment.text}"
                  </p>

                  {/* FIXED ARTICLE LINK */}
                  {comment.postId && (
                    <Link href={`/news/${comment.postId.slug}`} target="_blank" className="text-xs text-indigo-600 flex items-center gap-1 hover:underline">
                      On Article: {comment.postId.title}
                      <ArrowRight size={12} />
                    </Link>
                  )}

                  <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10}/> {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 self-end md:self-center">
                {comment.status !== 'Approved' && (
                  <button
                    onClick={() => handleStatusUpdate(comment._id, 'Approved')}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 rounded-lg transition-all"
                    title="Approve"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}

                <button
                  onClick={() => handleStatusUpdate(comment._id, 'Rejected')}
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
