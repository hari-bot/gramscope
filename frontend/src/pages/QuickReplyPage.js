import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Send, Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function QuickReplyPage() {
  const [latestMessage, setLatestMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchLatestMessage = async () => {
      if (accessToken) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/instagram/latest-message?accessToken=${accessToken}`
          );
          const data = await response.json();
          setLatestMessage(data.latestMessage);
          setConversationId(data.latestConversationId);
        } catch (error) {
          console.error("Failed to fetch the latest message:", error);
          toast.error("Failed to fetch the latest message. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLatestMessage();
  }, [accessToken]);

  const handleReply = async () => {
    if (accessToken && conversationId && replyMessage.trim()) {
      try {
        setIsSending(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/instagram/reply-to-message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken,
              conversationId,
              igId: latestMessage.from.id,
              message: replyMessage,
            }),
          }
        );
        const data = await response.json();
        console.log("Reply sent successfully:", data);
        toast.success("Reply sent successfully!");
        setReplyMessage(""); // Clear the reply input after sending
      } catch (error) {
        console.error("Failed to send reply:", error);
        toast.error("Failed to send reply. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Quick Reply
        </h2>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : latestMessage ? (
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="font-semibold text-lg mb-2">
                  {latestMessage.from.username}
                </p>
                <p className="text-gray-700 mb-2">{latestMessage.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(latestMessage.created_time).toLocaleString()}
                </p>
              </div>
              <div className="space-y-4">
                <textarea
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Write your reply here..."
                  rows="4"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <button
                  onClick={handleReply}
                  disabled={isSending || !replyMessage.trim()}
                  className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition flex items-center justify-center"
                >
                  {isSending ? (
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No messages found.
            </div>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </Layout>
  );
}

export default QuickReplyPage;
