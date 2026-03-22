const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    avatar: String,
    providers: {
      google: {
        id: {
          type: String,
          unique: true,
          sparse: true,
          index: true,
        },
        email: String,
      },
      telegram: {
        id: {
          type: String,
          unique: true,
          sparse: true,
          index: true,
        },
        username: String,
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User-Patungan", userSchema);

module.exports = User;
