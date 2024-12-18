const axios = require("axios");
const config = require("../config/instagramConfig");

exports.instagramLogin = (req, res) => {
  // const authURL = `https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientID}&redirect_uri=${config.redirectURI}&response_type=code&scope=business_basic,business_manage_messages,business_content_publish,`;
  const authURL = `https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientID}&redirect_uri=${config.redirectURI}&response_type=code&scope=instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages`;

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

//mobile

exports.instagramMobileLogin = (req, res) => {
  // const authURL = `https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientID}&redirect_uri=${config.redirectURI}&response_type=code&scope=business_basic,business_manage_messages,business_content_publish,`;
  const authURL = `https://www.instagram.com/oauth/authorize?client_id=${config.instagramClientID}&redirect_uri=${config.redirectURI}-mobile&response_type=code&scope=instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages`;

  res.redirect(authURL);
};

exports.instagramMobileCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      `https://api.instagram.com/oauth/access_token`,
      new URLSearchParams({
        client_id: config.instagramClientID,
        client_secret: config.instagramClientSecret,
        grant_type: "authorization_code",
        redirect_uri: `${config.redirectURI}-mobile`,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = response.data.access_token;
    const userId = response.data.user_id;
    res.redirect(
      `exp://192.168.1.12:8081?accessToken=${accessToken}&userId=${userId}`
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
