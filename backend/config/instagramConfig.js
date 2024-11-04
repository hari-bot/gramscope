require("dotenv").config();

module.exports = {
  instagramClientID: process.env.INSTAGRAM_CLIENT_ID,
  instagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  redirectURI: process.env.REDIRECT_URI,
  frontendUrl: process.env.REACT_APP_FRONTEND_URL,
};
