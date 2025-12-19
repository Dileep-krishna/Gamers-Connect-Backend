const users = require("../model/userModel.js");
const admins = require("../model/adminmodel");
const jwt = require("jsonwebtoken");
// const user = require("../models/adminBanModel");


exports.registerController = async (req, res) => {
  // console.log(req)
  console.log("inside the register controller")
  const { username, password, email } = req.body
  // console.log(username,password,email);

  //register logic
  try {

    const existingUser = await users.findOne({ email, username })
    if (existingUser) {
      res.status(404).json("user already exists please login.....")
    } else {

      const newUser = new users({
        username,
        email,
        password
      })
      await newUser.save()
      res.status(200).json(newUser)
    }


  } catch (error) {
    res.status(500).json(error)
  }
}
//login controller
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("inside the login controller");

  try {
    // ================= ADMIN LOGIN (FIXED) =================
    if (email === "admin@gmail.com" && password === "admin") {

      const adminUser = await admins.findOne({ email });

      if (!adminUser) {
        return res.status(404).json({
          success: false,
          message: "Admin not found in database"
        });
      }

      const token = jwt.sign(
        {
          id: adminUser._id,
          userMail: adminUser.email,
          role: "admin"
        },
        process.env.JWTSecretKey,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        existingUser: adminUser,
        token
      });
    }
    // ================= ADMIN LOGIN END =================


    // ================= USER LOGIN =================
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🚫 BANNED USER — SEND ADMIN MESSAGE
    if (existingUser.isBanned) {
      return res.status(403).json({
        success: false,
        banReason: existingUser.banReason
      });
    }

    if (existingUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: existingUser._id, userMail: existingUser.email, role: "user" },
      process.env.JWTSecretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      existingUser,
      token
    });
    // ================= USER LOGIN END =================

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//update user profile 
exports.userProfileController = async (req, res) => {
  console.log("Inside profile update controller");

  try {
    const { username, bio, orginalname } = req.body;

    const updateData = { username, bio, orginalname };

    if (req.file) {
      updateData.profile = req.file.filename;
    }

    const updatedUser = await users.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//get user profile controller
exports.getUserProfileController = async (req, res) => {
  console.log("Inside get profile controller");

  try {
    const user = await users
      .findById(req.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json(error);
  }
  console.log("User ID:", req.userId);
  console.log("User Mail:", req.userMail);

};
// -----------------------------admin----------------------

//get all users in admin
exports.adminUserController = async (req, res) => {
  console.log('inside the user admin controller');
  try {
    const allUsers = await users.find()
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json(error)
  }

}

//admin profile controller

exports.adminProfileController = async (req, res) => {
  console.log("Inside admin profile update controller");

  try {
    const { username, bio, orginalname } = req.body;

    const updateData = { username, bio, orginalname };

    if (req.file) {
      updateData.profile = req.file.filename;
    }

    const updatedAdmin = await admins.findByIdAndUpdate(
      req.adminId,
      updateData,
      { new: true }
    ).select("-password"); // exclude password field

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      admin: updatedAdmin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// admin user delete

// admin user delete
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await users.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const Post = require("../model/postModel");  // <--- Add this at the top

exports.deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting post with id:", id);

    // Check if id is valid MongoDB ObjectId before querying
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      console.log("No post found to delete with id:", id);
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    console.log("Post deleted successfully");
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};
//admin ban

// controller/adminController.js
exports.toggleBanUser = async (req, res) => {
   console.log("req.body:", req.body); 
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBanned = !user.isBanned;

    // store reason only when banning
    if (user.isBanned) {
      user.banReason = reason || "Violation of platform rules";
    } else {
      user.banReason = "";
    }

    await user.save();

       res.status(200).json({
      success: true,
      isBanned: user.isBanned,
      banReason: user.banReason,
      message: user.isBanned
        ? "User banned successfully"
        : "Welcome back to GamersConnect"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//user feedback modal

exports.sendBanFeedback = async (req, res) => {
  try {
    const { message, email } = req.body;

    if (!message || !email) {
      return res.status(400).json({
        success: false,
        message: "Message and email are required"
      });
    }

    const user = await users.findOne({ email });

    if (!user || !user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Only banned users can send feedback"
      });
    }

    user.feedbacks.push({ message });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Feedback sent to admin"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


