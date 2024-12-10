const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/instagram", authController.instagramLogin);
router.get("/instagram/callback", authController.instagramCallback);
router.get(
  "/instagram/mobile-callback",
  authController.instagramMobileCallback
);

module.exports = router;
