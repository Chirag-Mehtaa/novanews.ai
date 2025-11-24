"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { MessageSquare, User, Send, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// Make sure to pass the postId prop from ArticleView.jsx
export const CommentSection = ({ postId }) => { 
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState(null);

  // --- 1. Fetch Approved Comments ---
  const fetchComments = async () => {
    if (!postId) return; 
    setLoading(true);
    try {
        const res = await fetch(`/api/comments?postId=${postId}`);
        const data = await res.json();
        if (data.success) {
            setComments(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch comments:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // Clean up submit message after a few seconds
    const timer = setTimeout(() => setSubmitMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [postId, submitMessage]); 

  // --- 2. Post New Comment Handler ---
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (commentText.trim().length < 5) {
        setSubmitMessage({ type: 'error', text: 'Comment is too short.' });
        return;
    }
    
    try {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content: commentText.trim() })
        });
        
        const result = await res.json();
        
        if (result.success) {
            setCommentText('');
            // Show success message: Pending approval
            setSubmitMessage({ type: 'success', text: result.message }); 
        } else {
            setSubmitMessage({ type: 'error', text: result.message || 'Failed to post comment.' });
        }
    } catch (error) {
        setSubmitMessage({ type: 'error', text: 'Network error. Could not post comment.' });
    }
  };


  return (
    <div className="pt-10 border-t border-white/10 mt-10">
      <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-teal-accent" /> Comments 
        <span className="text-sm text-slate-500 font-sans ml-2">({comments.length})</span>
      </h3>

      {/* --- Comment Submission Box --- */}
      {session ? (
        <form onSubmit={handlePostComment} className="mb-10 p-6 bg-navy-light/50 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex gap-4 items-start">
            <img 
              src={session.user.image || `https://placehold.co/100x100?text=${session.user.name?.charAt(0) || 'U'}`} 
              className="w-10 h-10 rounded-full border border-teal-accent/50 object-cover" 
              referrerPolicy="no-referrer"
              alt={session.user.name}
            />
            <div className="flex-grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Comment as ${session.user.name}...`}
                rows="3"
                className="w-full bg-navy-light border border-white/10 rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-teal-accent/50 transition-colors placeholder-slate-500 resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!commentText.trim() || loading}
                  className="flex items-center gap-2 bg-teal-accent text-navy-dark px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" /> Post Comment
                </button>
              </div>
            </div>
          </div>
          {submitMessage && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm font-bold ${
                submitMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 
                'bg-red-500/10 text-red-300 border border-red-500/30'
            }`}>
              {submitMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {submitMessage.text}
            </div>
          )}
        </form>
      ) : (
        <div className="mb-10 p-6 bg-navy-light/50 rounded-2xl border border-white/5 text-center">
          <p className="text-slate-300 mb-4">You need to sign in to leave a comment.</p>
          <button
            onClick={() => signIn('google')}
            className="bg-teal-accent text-navy-dark px-6 py-2.5 rounded-lg font-bold hover:scale-105 transition-transform"
          >
            Sign In to Comment
          </button>
        </div>
      )}
      
      {/* --- COMMENTS LIST --- */}
      {loading ? (
        <div className="flex justify-center text-teal-accent py-10">
            <Loader2 size={30} className="animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
            No approved comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 p-6 bg-navy-light/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                <img 
                    src={comment.userId.image || `https://placehold.co/100x100?text=${comment.userId.name?.charAt(0) || 'U'}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    alt={comment.userId.name}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-white text-sm">{comment.userId.name}</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  <span className="text-xs text-slate-400">
                    <Clock size={12} className="inline mr-1"/>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-text-primary text-md leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};