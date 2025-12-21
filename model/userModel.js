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

  isBanned: {
    type: Boolean,
    default: false
  },

  banReason: {
    type: String,
    default: ""
  },

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
  ],

  // ✅ ADD ONLY THESE TWO FIELDS
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ]
});

const users = mongoose.model("users", userSchema);
module.exports = users;
