const users = require("../model/userModel");
const admins = require('../model/adminmodel');
const jwt=require('jsonwebtoken')

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

      // 🔹 Find admin from DB
      const adminUser = await admins.findOne({ email });

      if (!adminUser) {
        return res.status(404).json({
          success: false,
          message: "Admin not found in database"
        });
      }

      const token = jwt.sign(
        {
          id: adminUser._id,          // ✅ REAL ObjectId
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


    // ================= USER LOGIN (UNCHANGED) =================
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
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
    const { username, bio,orginalname } = req.body;

    const updateData = { username, bio,orginalname };

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
exports.adminUserController=async(req,res)=>{
  console.log('inside the user admin controller');
  try {
    const allUsers=await users.find()
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

//admin user delete
// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await User.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };