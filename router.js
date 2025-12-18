const express = require("express");
const {
  registerController,
  loginController,
  userProfileController,
  getUserProfileController,
  adminUserController,
  deleteUser,
  adminProfileController
} = require("./controller/userController");
const { createPostController, getUserPostsController, getAllPostsController } = require("./controller/PostController");
const jwtMiddleware = require("./middlewares/jwtMiddleware");
const multerConfig = require("./middlewares/imgMulterMiddleware");
const adminJwtMiddleware = require("./middlewares/adminJwtMiddleware");
const multer = require("multer");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// Protect post creation with JWT and accept multiple files with field name 'uploadImages'
router.post("/create-post", jwtMiddleware, multerConfig.array("uploadImages", 5), createPostController);

// router.get("/test", (req, res) => {
//   res.json({ message: "Router is working ✅" });
// });
//get user post
router.get("/home-post", jwtMiddleware, getUserPostsController)

// //get all user post
// router.get("/home-post",getAllPostsController)

// update userProfile
router.get(
  "/profile",
  jwtMiddleware,
  getUserProfileController
);

router.put(
  "/profile-update",
  jwtMiddleware,
  multerConfig.single("profile"),
  userProfileController
);
// ------admin-------

router.get("/get-allUsers",adminUserController)

//admin profile update

router.put(
  '/admin/profile',
  adminJwtMiddleware,   
  multerConfig.single('profile'),  
  adminProfileController
);;


//admin delete user
// router.delete("/delete-user/:id", deleteUser);

router.delete(
  "/delete-user/:id",
 adminJwtMiddleware,
  deleteUser
);





module.exports = router;