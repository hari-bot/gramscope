const axios = require("axios");
const config = require("../config/instagramConfig");

exports.instagramLogin = (req, res) => {
  const authURL = `https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientID}&redirect_uri=${config.redirectURI}&response_type=code&scope=business_basic,business_manage_messages,business_content_publish,instagram_business_manage_comments`;
  res.redirect(authURL);
};

exports.instagramCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      `https://api.instagram.com/oauth/access_token`,
      new URLSearchParams({
        client_id: config.instagramClientID,
        client_secret: config.instagramClientSecret,
        grant_type: "authorization_code",
        redirect_uri: config.redirectURI,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = response.data.access_token;
    const userId = response.data.user_id;
    res.redirect(
      `${config.frontendUrl}/profile?accessToken=${accessToken}&userId=${userId}`
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
