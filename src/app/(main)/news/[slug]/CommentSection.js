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

  // ======================
  // FETCH APPROVED COMMENTS
  // ======================
  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/news/${postId}/comments`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setComments(data.data || []);
        }
      } catch (err) {
        console.error("Comments load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // ======================
  // POST NEW COMMENT
  // ======================
  const handlePost = async (e) => {
    e.preventDefault();

    if (!session) return signIn();
    if (!newComment.trim()) return;

    setStatus("submitting");

    try {
      const payload = {
        text: newComment.trim(),
        userId: session?.user?.id || session?.user?._id,
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

        setTimeout(() => setStatus("idle"), 2500);
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

      {/* INPUT AREA */}
      <div className="mb-10 bg-[#112240] p-6 rounded-xl border border-[#233554]">
        {!session ? (
          <div className="text-center py-4 flex flex-col items-center">
            <Lock className="mb-2 text-[#8892b0]" />
            <p className="text-[#8892b0] mb-3">Login to join the discussion</p>
            <button
              onClick={() => signIn()}
              className="bg-[#64ffda] text-[#0a192f] px-6 py-2 rounded font-bold"
            >
              Sign In
            </button>
          </div>
        ) : status === "success" ? (
          <div className="text-center py-6 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
            <div className="text-emerald-400 text-xl font-bold mb-2">✅ Sent for Approval!</div>
            <p className="text-[#8892b0]">Admin will review your comment shortly.</p>
          </div>
        ) : (
          <form onSubmit={handlePost}>
            <div className="flex items-center gap-2 mb-2 text-sm text-[#8892b0]">
              <User size={14}/> Posting as <span className="text-white">{session.user?.name}</span>
            </div>

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
                {status === "submitting" ? (
                  <Loader2 className="animate-spin" size={18}/>
                ) : (
                  <Send size={18}/>
                )}
                {status === "submitting" ? "Sending..." : "Post"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* COMMENTS LIST */}
      {loading ? (
        <div className="text-center text-[#8892b0]">Loading comments...</div>
      ) : comments.length ? (
        <div className="space-y-6">
          {comments.map((c) => (
            <div
              key={c._id}
              className="flex gap-4 p-4 rounded-lg hover:bg-[#112240]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700">
                {c.userId?.image ? (
                  <img
                    src={c.userId.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="p-2 text-white"/>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[#e6f1ff]">
                    {c.userId?.name}
                  </span>
                  <span className="text-xs text-[#8892b0]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed border-[#233554] rounded-xl text-[#8892b0] italic">
          No approved comments yet.
        </div>
      )}
    </div>
  );
};
