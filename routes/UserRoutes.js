const express = require("express");
const router = express();
const { check } = require("express-validator");

const UserCtrl = require("../controllers/UserCtrl");
const User = require("../models/User");
const UserExist = require("../middlewares/userExist");

router.get("/users", UserCtrl.getAllUsers);
router.post(
  "/new-user",
  [
    check(
      "username",
      "تعداد کاراکتر نام کاربری باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check("username", "لطفا نام کاربری دیگری انتخاب کنید...").custom(
      (value) => {
        return User.find({
          username: value,
        }).then((user) => {
          if (user.length > 1) {
            throw "لطفا نام کاربری دیگری انتخاب کنید...";
          }
        });
      }
    ),
    check(
      "displayname",
      "تعداد کاراکتر نام نمایشی باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check(
      "password",
      "تعداد کاراکتر رمز عبور باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
    check("email", "لطفا ایمیل دیگری انتخاب کنید...").custom((value) => {
      return User.find({
        email: value,
      }).then((user) => {
        if (user.length > 1) {
          throw "لطفا ایمیل دیگری انتخاب کنید...";
        }
      });
    }),
    check(
      "favoriteProducts",
      "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!"
    ).isArray(),
    check(
      "userProducts",
      "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!"
    ).isArray(),
    check(
      "comments",
      "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!"
    ).isArray(),
    check(
      "payments",
      "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!"
    ).isArray(),
    check("cart", "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!").isArray(),
    check(
      "viewed",
      "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!"
    ).isBoolean(),
    check(
      "userIsActive",
      "فرمت یکی از ورودی‌های ثبت نام کاربر اشتباه است!"
    ).isBoolean(),
  ],
  UserCtrl.registerUser
);
router.post(
  "/login-user",
  [
    check(
      "password",
      "تعداد کاراکتر رمز عبور باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
  ],
  UserCtrl.loginUser
);
router.post(
  "/update-user/:id",
  [
    check(
      "username",
      "تعداد کاراکتر نام کاربری باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check(
      "displayname",
      "تعداد کاراکتر نام نمایشی باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check(
      "password",
      "تعداد کاراکتر رمز عبور باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
    check("email", "لطفا ایمیل دیگری انتخاب کنید...").custom((value) => {
      return User.find({
        email: value,
      }).then((user) => {
        if (user.length > 1) {
          throw "لطفا ایمیل دیگری انتخاب کنید...";
        }
      });
    }),
    check("username", "لطفا نام کاربری دیگری انتخاب کنید...").custom(
      (value) => {
        return User.find({
          username: value,
        }).then((user) => {
          if (user.length > 1) {
            throw "لطفا نام کاربری دیگری انتخاب کنید...";
          }
        });
      }
    ),
  ],
  UserCtrl.updateUser
);
router.post(
  "/mini-update-user/:id",
  [
    check(
      "displayname",
      "تعداد کاراکتر نام نمایشی باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check(
      "password",
      "تعداد کاراکتر رمز عبور باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
  ],
  UserCtrl.miniUpdateUser
);
router.post("/update-email-user", UserExist, UserCtrl.emailSenderChanger);
router.post("/confirm-user-email", UserExist, UserCtrl.confirmEmail);
router.post("/delete-user/:id", UserCtrl.deleteUser);

// FOR ADMIN
router.get("/get-user/:id", UserCtrl.getOneUserById);
// FOR USER
router.get("/get-user-data", UserExist, UserCtrl.getUserDataAccount);

router.post(
  "/search-user",
  [check("email", "فرمت ایمیل اشتباه است!").isEmail()],
  UserCtrl.SearchUsers
);

router.get(
  "/get-part-of-user-data/:slug",
  UserExist,
  UserCtrl.getPartOfUserData
);

module.exports = router;
