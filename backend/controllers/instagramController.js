const axios = require("axios");
const { response } = require("express");

exports.getProfileInfo = async (req, res) => {
  const { accessToken } = req.query;
  try {
    const profileResponse = await axios.get(`https://graph.instagram.com/me`, {
      params: {
        fields:
          "id,username,name,account_type,media_count,followers_count,follows_count,profile_picture_url,biography",
        access_token: accessToken,
      },
    });
    res.json(profileResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserFeed = async (req, res) => {
  const { accessToken } = req.query;
  try {
    const feedResponse = await axios.get(
      `https://graph.instagram.com/me/media`,
      {
        params: {
          fields:
            "id,caption,media_type,media_url,timestamp,like_count,comments_count",
          access_token: accessToken,
        },
      }
    );
    res.json(feedResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMediaComments = async (req, res) => {
  const { accessToken, mediaId } = req.query;
  try {
    const commentsResponse = await axios.get(
      `https://graph.instagram.com/${mediaId}/comments`,
      {
        params: {
          fields: "id,text,username,created_time",
          access_token: accessToken,
        },
      }
    );
    res.json(commentsResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { accessToken, commentId } = req.query;
  try {
    await axios.delete(`https://graph.instagram.com/${commentId}`, {
      params: { access_token: accessToken },
    });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.replyToComment = async (req, res) => {
  const { accessToken, commentId, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.instagram.com/${commentId}/replies?message=${message}&access_token=${accessToken}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestMessage = async (req, res) => {
  const { accessToken } = req.query;

  try {
    // Step 1: Get the list of conversations
    const conversationsResponse = await axios.get(
      `https://graph.instagram.com/v21.0/me/conversations`,
      {
        params: { access_token: accessToken },
      }
    );

    const conversations = conversationsResponse.data.data;
    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ error: "No conversations found" });
    }

    // Step 2: Get the latest conversation
    const latestConversationId = conversations[0].id;

    // Step 3: Get the messages id in the latest conversation
    const messagesResponse = await axios.get(
      `https://graph.instagram.com/v21.0/${latestConversationId}`,
      {
        params: {
          fields: "messages",
          access_token: accessToken,
        },
      }
    );

    const messages = messagesResponse.data.messages.data;
    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found in the latest conversation" });
    }

    const latestMessageId = messages[0].id;

    // Step 4: Get the latest message
    const latestMessageResponse = await axios.get(
      `https://graph.instagram.com/v21.0/${latestMessageId}`,
      {
        params: {
          fields: "id,created_time,from,to,message",
          access_token: accessToken,
        },
      }
    );

    const latestMessage = latestMessageResponse.data;

    res.json({ latestMessage, latestConversationId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reply to the latest message in the conversation
exports.replyToMessage = async (req, res) => {
  const { accessToken, igId, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.instagram.com/v21.0/me/messages`,
      {
        recipient: {
          id: igId,
        },
        message: {
          text: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
