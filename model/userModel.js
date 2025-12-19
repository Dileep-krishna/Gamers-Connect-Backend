const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  profile: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    default: "GamersConnect user"
  },

  bio: {
    type: String,
    default: "user"
  },

  orginalname: {
    type: String,
    default: "user"
  },

  // 🔴 ADD THIS FIELD ONLY
  isBanned: {
    type: Boolean,
    default: false
  },
   banReason: {
    type: String,
    default: ""
  },
    // 📨 USER FEEDBACK (ADD HERE 👇)
  feedbacks: [
    {
      message: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});


const users = mongoose.model("users", userSchema);
module.exports = users;
