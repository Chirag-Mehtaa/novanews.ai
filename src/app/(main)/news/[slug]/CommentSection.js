'use client';
import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MessageSquare, Send, User, Loader2, Lock } from 'lucide-react';

export const CommentSection = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState('idle');
  const [loading, setLoading] = useState(true);

  // LOAD COMMENTS
  useEffect(() => {
    if (!postId) return;

    const loadComments = async () => {
      try {
        const res = await fetch(`/api/news/${postId}/comments`, {
          cache: "no-store"
        });
        const data = await res.json();
        if (data.success) setComments(data.data);
      } catch (err) {
        console.error("Comments load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  // POST COMMENT
  const handlePost = async (e) => {
    e.preventDefault();
    if (!session) return signIn();
    if (!newComment.trim()) return;

    setStatus("submitting");

    try {
      const payload = {
        text: newComment.trim(),
        userId: session.user.id
      };

      const res = await fetch(`/api/news/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setNewComment("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        alert("Error: " + data.error);
        setStatus("idle");
      }
    } catch (error) {
      console.error("Comment post error:", error);
      setStatus("idle");
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-[#233554]">
      <h3 className="text-2xl font-bold text-[#e6f1ff] mb-6 flex items-center gap-2">
        <MessageSquare className="text-[#64ffda]" /> Comments ({comments.length})
      </h3>

      <div className="mb-10 bg-[#112240] p-6 rounded-xl border border-[#233554]">
        {!session ? (
          <div className="text-center py-4 flex flex-col items-center">
            <Lock className="mb-2 text-[#8892b0]" />
            <p className="text-[#8892b0] mb-3">Login to join the discussion</p>
            <button onClick={() => signIn()} className="bg-[#64ffda] text-[#0a192f] px-6 py-2 rounded font-bold">
              Sign In
            </button>
          </div>
        ) : status === "success" ? (
          <div className="text-center py-6 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
            <div className="text-emerald-400 text-xl font-bold mb-2">Sent for Approval!</div>
          </div>
        ) : (
          <form onSubmit={handlePost}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What do you think?"
              className="w-full bg-[#0a192f] text-white p-4 rounded border border-[#233554] focus:border-[#64ffda] outline-none min-h-[100px]"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-[#64ffda] text-[#0a192f] px-6 py-2 rounded font-bold flex items-center gap-2"
              >
                {status === "submitting" ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                {status === "submitting" ? "Sending..." : "Post"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
