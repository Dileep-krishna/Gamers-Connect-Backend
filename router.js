const express = require("express");
const {
  registerController,
  loginController,
  userProfileController,
  getUserProfileController,
  adminUserController,
  deleteUser,
  adminProfileController,
  deletePostController,
  toggleBanUser,
  sendBanFeedback


} = require("./controller/userController");
const { createPostController, getUserPostsController, getAllPostsController } = require("./controller/PostController");
const jwtMiddleware = require("./middlewares/jwtMiddleware");
const multerConfig = require("./middlewares/imgMulterMiddleware");
const adminJwtMiddleware = require("./middlewares/adminJwtMiddleware");
const multer = require("multer");



const router = express.Router();
//register
router.post("/register", registerController);
//login
router.post("/login", loginController);

//create post
router.post("/create-post", jwtMiddleware, multerConfig.array("uploadImages", 5), createPostController);


//get user post
router.get("/home-post", jwtMiddleware, getUserPostsController)



// update userProfile
router.get(
  "/profile",
  jwtMiddleware,
  getUserProfileController
);
//
router.put(
  "/profile-update",
  jwtMiddleware,
  multerConfig.single("profile"),
  userProfileController
);
// ------admin-------

router.get("/get-allUsers", adminUserController)

//admin profile update

router.put(
  '/admin/profile',
  adminJwtMiddleware,
  multerConfig.single('profile'),
  adminProfileController
);;


//admin delete user


router.delete(
  "/delete-user/:id",
  adminJwtMiddleware,
  deleteUser
);


// delete post
router.delete(
  "/admin/delete-post/:id",
  adminJwtMiddleware,
  deletePostController
);

//admin user-ban model
// const { toggleBanUser } = require("../controller/adminController");


router.put("/ban-user/:id", adminJwtMiddleware, toggleBanUser);

router.post("/ban-feedback", sendBanFeedback);









module.exports = router;