const express = require("express");
const router = express();
const { check } = require("express-validator");

const UserCtrl = require("../controllers/UserCtrl");
const User = require("../models/User");

const userExist = require("../middlewares/userExist");
const isAdmin = require("../middlewares/isAdmin");

// rate limiter
const rateLimit = require("express-rate-limit");
const loginRegisterLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({
      msg: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً دوباره تلاش کنید.",
    });
  },
});

router.get("/users", isAdmin, UserCtrl.getAllUsers);
router.post(
  "/new-user",
  loginRegisterLimiter,
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
router.post("/user-reactivation-code", userExist, UserCtrl.reActivateUserCode);
router.post(
  "/login-user",
  loginRegisterLimiter,
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
  isAdmin,
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
  userExist,
  UserCtrl.miniUpdateUser
);
router.post("/update-email-user", userExist, UserCtrl.emailSenderChanger);
router.post("/confirm-user-email", userExist, UserCtrl.confirmEmail);
router.post("/delete-user/:id", isAdmin, UserCtrl.deleteUser);
router.get("/get-user/:id", isAdmin, UserCtrl.getOneUserById);
router.get("/get-user-data", userExist, UserCtrl.getUserDataAccount); // FOR USER
router.get("/get-user-admin-data", isAdmin, UserCtrl.getUserAdminData); // FOR ADMIN

router.post(
  "/search-user",
  [check("email", "فرمت ایمیل اشتباه است!").isEmail()],
  isAdmin,
  UserCtrl.SearchUsers
);
router.get(
  "/get-part-of-user-data/:slug",
  userExist,
  UserCtrl.getPartOfUserData
);
router.post("/favourite-products", userExist, UserCtrl.favouriteProductsMan);
router.post("/cart-managment", userExist, UserCtrl.cartMan);
router.get("/cart-number", UserCtrl.cartNumber);
router.get("/uncheck-payment/:id", isAdmin, UserCtrl.uncheckPayment);
router.get("/uncheck-comment/:id", isAdmin, UserCtrl.uncheckComment);

module.exports = router;
