const express = require("express");
const router = express();
const { check } = require("express-validator");

const UserCtrl = require("../controllers/UserCtrl");
const User = require("../models/User");

router.get("/users", UserCtrl.getAllUsers);
// router.post(
//   "/new-user",
//   [
//     check(
//       "title",
//       "تعداد کاراکتر عنوان مقاله باید بیشتر از 5 کاراکتر باشد!"
//     ).isLength({
//       min: 5,
//     }),
//     check("published", "فرمت بخش انتشار اشتباه است!").isBoolean(),
//     check("relatedusers", "فرمت بخش مقالات مرتبط اشتباه است!").isArray(),
//     check("tags", "فرمت بخش تگ‌ها اشتباه است!").isArray(),
//     check("slug", "لطفا اسلاگ دیگری انتخاب کنید...").custom((value) => {
//       return User.find({
//         slug: value,
//       }).then((user) => {
//         if (user.length > 0) {
//           throw "لطفا اسلاگ دیگری انتخاب کنید...";
//         }
//       });
//     }),
//   ],
//   UserCtrl.newuser
// );
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
router.post("/delete-user/:id", UserCtrl.deleteUser);
router.get("/get-user-by-id/:id", UserCtrl.getOneUserById);
router.post(
  "/search-user",
  [check("email", "فرمت ایمیل اشتباه است!").isEmail()],
  UserCtrl.SearchUsers
);

module.exports = router;
