const users = require("../model/userModel");
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
  console.log('inside the login comntroller');
  
  try {
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
      { id: existingUser._id, userMail: existingUser.email },
      process.env.JWTSecretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      existingUser,
      token
    });

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




