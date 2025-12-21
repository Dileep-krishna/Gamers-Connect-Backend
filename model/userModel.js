const mongoose = require("mongoose");

/* ===============================
   CHAT MESSAGE SUB-SCHEMA
   (Same as ChatMessage model)
================================ */
const chatMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

/* ===============================
   NOTIFICATION SUB-SCHEMA
================================ */
const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. "follow"
  message: { type: String, required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

/* ===============================
   USER SCHEMA (UNCHANGED FIELDS)
================================ */
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
  ],

  // ✅ CHAT METADATA (already approved)
  online: {
    type: Boolean,
    default: false
  },

  lastSeen: {
    type: Date
  },

  // ✅ CHAT IMPLEMENTATION (NEW – SAFE)
  chats: [chatMessageSchema],

  // ✅ NOTIFICATIONS IMPLEMENTATION (NEW)
  notifications: [notificationSchema]
});

const users = mongoose.model("users", userSchema);
module.exports = users;
