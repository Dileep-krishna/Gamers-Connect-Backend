const express = require("express");
const {
  registerController,
  loginController
} = require("./controller/userController");
const { createPostController, getUserPostsController, getAllPostsController } = require("./controller/PostController");
const jwtMiddleware = require("./middlewares/jwtMiddleware");
const multerConfig = require("./middlewares/imgMulterMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// Protect post creation with JWT and accept multiple files with field name 'uploadImages'
router.post("/create-post", jwtMiddleware, multerConfig.array("uploadImages", 5), createPostController);

router.get("/test", (req, res) => {
  res.json({ message: "Router is working ✅" });
});
//get user post
router.get("/home-post",jwtMiddleware,getUserPostsController)

// //get all user post
// router.get("/home-post",getAllPostsController)

// //



module.exports = router;
