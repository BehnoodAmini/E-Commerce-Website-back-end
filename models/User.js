const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  displayname: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  favoriteProducts: {
    required: true,
    type: Array,
    default: [],
  },
  userProducts: {
    required: true,
    type: Array,
    default: [],
  },
  payments: {
    required: true,
    type: Array,
    default: [],
  },
  comments: {
    required: true,
    type: Array,
    default: [],
  },
  cart: {
    required: true,
    type: Array,
    default: [],
  },
  viewed: {
    required: true,
    type: Boolean,
    default: false,
  },
  activateCode: {
    required: true,
    type: Number,
  },
  activateCodeCounter: {
    required: true,
    type: Number,
    default: 3,
  },
  activateCodeCounterLastReset: {
    type: Date,
    default: Date.now,
  },
  userIsActive: {
    required: true,
    type: Boolean,
    default: false,
  },
  emailSend: {
    required: true,
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  updatedAt: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
});
module.exports = mongoose.model("USER", UserSchema);
