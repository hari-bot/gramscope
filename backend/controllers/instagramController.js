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
    console.log(error);
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
  console.log("woof");
  const { accessToken, commentId, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.instagram.com/${commentId}/replies?message=${message}&access_token=${accessToken}`
    );
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
