const posts = require("../model/postModel");

const createPostController = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      content,
      mediaType = "none",
      game = "",
      tags,
      visibility = "public",
      schedulePost = false,
      scheduleTime,
      allowComments = "true",  
      allowReactions = "true"
    } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    let mediaFiles = [];
    if (req.files && req.files.length > 0) {
      mediaFiles = req.files.map(file => file.filename);
    }

    if ((mediaType === "image" || mediaType === "video") && mediaFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Media file is required for image/video posts"
      });
    }

    // Convert string booleans to actual booleans
    const allowCommentsBool = allowComments === "true";
    const allowReactionsBool = allowReactions === "true";

    // Parse tags JSON string safely
    let parsedTags = [];
    try {
      parsedTags = tags ? JSON.parse(tags) : [];
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format for tags"
      });
    }

    // Check that userId and userMail are present from JWT middleware
    if (!req.userId || !req.userMail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User info missing from token"
      });
    }

    const newPost = new posts({
      userId: req.userId,
      userMail: req.userMail,
      content,
      mediaType,
      mediaFile: mediaFiles,
      game,
      tags: parsedTags,
      visibility,
      schedulePost,
      scheduleTime: scheduleTime ? new Date(scheduleTime) : null,
      allowComments: allowCommentsBool,
      allowReactions: allowReactionsBool
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost
    });

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//get user posts
const getUserPostsController = async (req, res) => {
 console.log("inside the user-post controller");
 try {
    const userPost=await posts.find()
    res.status(200).json(userPost)
 } catch (error) {
    res.status(500).json(error)
 }
};

//delete post controller
// controller/postController.js


module.exports = {
  createPostController,
  getUserPostsController,

};
