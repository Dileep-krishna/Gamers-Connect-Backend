const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  bio: String,
  orginalname: String,
  profile: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // add other admin fields if needed
});

module.exports = mongoose.model('admins', adminSchema);
