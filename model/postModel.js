const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        content: {
            type: String,
            required: true,
            maxlength: 1000
        },

        mediaType: {
            type: String,
            enum: ["none", "image", "video"],
            default: "none"
        },

        mediaFile: {
            type: [String],
            default: ""
        },

        game: {
            type: String,
            default: ""
        },

        tags: {
            type: [String],
            default: []
        },

        visibility: {
            type: String,
            enum: ["public", "friends", "private"],
            default: "public"
        },

        userMail: {
            type: String,
            required: true
        },

        schedulePost: {
            type: Boolean,
            default: false
        },

        scheduleTime: {
            type: Date,
            default: null
        },

        allowComments: {
            type: Boolean,
            default: true
        },

        allowReactions: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const posts = mongoose.model("posts", postSchema);

module.exports = posts;
