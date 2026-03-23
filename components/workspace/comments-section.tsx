"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Edit2,
  Trash2,
  Reply,
  X,
  Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MentionInput } from "@/components/workspace/mention-input";
import { MentionDisplay } from "@/components/workspace/mention-display";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  replies?: Comment[];
}

interface CommentsSectionProps {
  pageId: string;
  workspaceId: string;
}

export function CommentsSection({ pageId, workspaceId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, pageId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?pageId=${pageId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !session?.user?.id) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          pageId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReply(parentId: string) {
    if (!replyContent.trim() || !session?.user?.id) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          pageId,
          parentId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? {
                ...comment,
                replies: [...(comment.replies || []), data.comment],
              }
              : comment
          )
        );
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  }

  async function handleUpdateComment(id: string) {
    if (!editContent.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          content: editContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === id
              ? data.comment
              : {
                ...comment,
                replies: comment.replies?.map((reply) =>
                  reply.id === id ? data.comment : reply
                ),
              }
          )
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  }

  async function handleDeleteComment(id: string) {
    if (!confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prev) =>
          prev
            .filter((comment) => comment.id !== id)
            .map((comment) => ({
              ...comment,
              replies: comment.replies?.filter((reply) => reply.id !== id),
            }))
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => {
    const isOwner = session?.user?.id === comment.user.id;
    const isEditing = editingId === comment.id;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
      <div className={`${isReply ? "ml-12 mt-3" : "mb-4"}`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                overflow: "hidden",
              }}
            >
              {comment.user.image ? (
                <img
                  src={comment.user.image}
                  alt={comment.user.name || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                comment.user.name?.charAt(0).toUpperCase() || "?"
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontWeight: "600", fontSize: "14px", color: "#e5e7eb" }}>
                {comment.user.name}
              </span>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {isEditing ? (
              <div style={{ marginTop: "8px" }}>
                <MentionInput
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="Edit comment..."
                  workspaceId={workspaceId}
                  autoFocus
                  rows={2}
                  className="w-full px-3 py-2 text-xs sm:text-sm text-gray-100 bg-slate-800 border-2 border-purple-600 rounded-xl outline-none resize-none"
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "white",
                      backgroundColor: "#7c3aed",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#e5e7eb",
                      backgroundColor: "#334155",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>

                <MentionDisplay content={comment.content} />

                {/* Actions */}
                <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                  {!isReply && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Reply className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  )}

                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {replyingTo === comment.id && (
              <div
                dir="ltr"
                style={{
                  marginTop: "12px",
                  direction: "ltr",
                  unicodeBidi: "normal",
                }}
              >
                <div
                  dir="ltr"
                  style={{
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  <MentionInput
                    value={replyContent}
                    onChange={setReplyContent}
                    placeholder="Write a reply... (type @ to mention)"
                    workspaceId={workspaceId}
                    autoFocus
                    rows={2}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-gray-100 bg-slate-800 border-2 border-purple-600 rounded-xl outline-none resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleAddReply(comment.id);
                      }
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyContent.trim()}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "white",
                      backgroundColor: replyContent.trim() ? "#7c3aed" : "#4b5563",
                      border: "none",
                      borderRadius: "8px",
                      cursor: replyContent.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: replyContent.trim() ? 1 : 0.5,
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#e5e7eb",
                      backgroundColor: "#334155",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "auto" }}>
                    ⌘+Enter
                  </span>
                </div>
              </div>
            )}
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: "56px",
          height: "56px",
          background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 40,
        }}
      >
        <MessageCircle className="w-6 h-6" />
        {comments.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "24px",
              height: "24px",
              backgroundColor: "#ef4444",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {comments.length}
          </span>
        )}
      </button>

      {/* Comments Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "100%",
              maxWidth: "384px",
              backgroundColor: "#1e293b",
              boxShadow: "-10px 0 50px rgba(0, 0, 0, 0.5)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MessageCircle className="w-5 h-5" style={{ color: "#a855f7" }} />
                <h3 style={{ fontWeight: "bold", color: "white", fontSize: "16px", margin: 0 }}>
                  Comments ({comments.length})
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "8px",
                  background: "none",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "#9ca3af",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
              }}
            >
              {comments.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: "48px", paddingBottom: "48px" }}>
                  <MessageCircle className="w-12 h-12" style={{ color: "#4b5563", margin: "0 auto 12px" }} />
                  <p style={{ color: "#9ca3af", fontWeight: "500", marginBottom: "4px" }}>
                    No comments yet
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    Be the first to comment!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>

            {/* New Comment Input */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #334155",
                backgroundColor: "#0f172a",
                flexShrink: 0,
              }}
            >

              <MentionInput
                value={newComment}
                onChange={setNewComment}
                placeholder="Write a comment... (type @ to mention someone)"
                workspaceId={workspaceId}
                rows={3}
                className="w-full px-3 py-2.5 text-sm text-gray-100 bg-slate-800 border-2 border-purple-600 rounded-xl outline-none resize-none"
                style={{
                  marginBottom: "8px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  ⌘+Enter to send
                </span>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || loading}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    background: newComment.trim() && !loading ? "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" : "#4b5563",
                    border: "none",
                    borderRadius: "8px",
                    cursor: newComment.trim() && !loading ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: newComment.trim() && !loading ? 1 : 0.5,
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Comment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}