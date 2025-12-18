const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  bio: String,
  orginalname: String,
  profile: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

});

module.exports = mongoose.model('admins', adminSchema);
