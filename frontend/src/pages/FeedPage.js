import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Heart, MessageCircle, Trash2, Send, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyMessage, setReplyMessage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
      return;
    }

    const fetchFeed = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/instagram/feed?accessToken=${accessToken}`
        );
        const feedResponse = await response.json();
        setFeed(feedResponse.data);
      } catch (error) {
        console.error("Error fetching feed:", error);
        toast.error("Failed to fetch feed. Please try again.");
      }
    };

    fetchFeed();
  }, [navigate]);

  const fetchComments = async (post) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/comments?accessToken=${accessToken}&mediaId=${post.id}`
      );
      const commentsResponse = await response.json();
      setComments(commentsResponse.data);
      setSelectedPost(post);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments. Please try again.");
    }
  };

  const deleteComment = async (commentId) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/delete-comment?accessToken=${accessToken}&commentId=${commentId}`,
        { method: "DELETE" }
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      setFeed((prevFeed) =>
        prevFeed.map((post) =>
          post.id === selectedPost.id
            ? { ...post, comments_count: post.comments_count - 1 }
            : post
        )
      );
      setSelectedPost((prevPost) => ({
        ...prevPost,
        comments_count: prevPost.comments_count - 1,
      }));
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const replyToComment = async (mediaId, commentId) => {
    const accessToken = localStorage.getItem("accessToken");
    const message = replyMessage[commentId] || "";
    if (!message.trim()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/reply-comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, mediaId, commentId, message }),
        }
      );
      const newReply = await response.json();
      setComments((prevComments) => [...prevComments, newReply]);
      setReplyMessage((prevMessages) => ({ ...prevMessages, [commentId]: "" }));
      setFeed((prevFeed) =>
        prevFeed.map((post) =>
          post.id === mediaId
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      );
      setSelectedPost((prevPost) => ({
        ...prevPost,
        comments_count: prevPost.comments_count + 1,
      }));
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error replying to comment:", error);
      toast.error("Failed to add reply. Please try again.");
    }
  };

  const handleReplyMessageChange = (commentId, message) => {
    setReplyMessage((prevMessages) => ({
      ...prevMessages,
      [commentId]: message,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Feed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feed.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={post.media_url}
                alt={post.caption}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-700 mb-4">{post.caption}</p>
                <div className="flex justify-between items-center text-gray-500 mb-4">
                  <button
                    className="flex items-center space-x-1 text-pink-500 hover:text-pink-600 transition-colors"
                    aria-label={`${post.like_count} likes`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.like_count}</span>
                  </button>
                  <button
                    onClick={() => fetchComments(post)}
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
                    aria-label={`View ${post.comments_count} comments`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments_count}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPost && (
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Comments for {selectedPost.caption}
            </h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">
                      <span className="font-semibold">{comment.username}:</span>{" "}
                      {comment.text}
                    </p>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Reply to this comment..."
                      value={replyMessage[comment.id] || ""}
                      onChange={(e) =>
                        handleReplyMessageChange(comment.id, e.target.value)
                      }
                      className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() =>
                        replyToComment(selectedPost.id, comment.id)
                      }
                      className="bg-purple-500 text-white rounded-full p-2 hover:bg-purple-600 transition-colors"
                      aria-label="Send reply"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        )}
      </Modal>
      <Toaster position="bottom-center" />
    </Layout>
  );
}

export default FeedPage;
