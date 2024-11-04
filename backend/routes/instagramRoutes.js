const express = require("express");
const router = express.Router();
const instagramController = require("../controllers/instagramController");

router.get("/profile", instagramController.getProfileInfo);
router.get("/feed", instagramController.getUserFeed);
router.get("/comments", instagramController.getMediaComments);
router.delete("/delete-comment", instagramController.deleteComment);
router.post("/reply-comment", instagramController.replyToComment);

module.exports = router;
