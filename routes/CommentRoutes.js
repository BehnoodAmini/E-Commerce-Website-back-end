const express = require("express");
const router = express();
const { check } = require("express-validator");

const CommentCtrl = require("../controllers/CommentCtrl");
const UserExist = require("../middlewares/userExist");

router.get("/comments", CommentCtrl.getAllComments);
router.post(
  "/new-comment",
  UserExist,
  [
    check(
      "message",
      "تعداد کاراکتر دیدگاه شما باید بیشتر از 2 کاراکتر باشد!"
    ).isLength({
      min: 3,
    }),
    check("src_id", "آیدی مرجع اشتباه است!").isLength({
      min: 24,
      max: 24,
    }),
    check("parentId", "آیدی کامنت مرجع اشتباه است!").isLength({
      min: 24,
      max: 24,
    }),
  ],
  CommentCtrl.newComment
);
router.post(
  "/update-comment/:id",
  [
    check(
      "message",
      "تعداد کاراکتر دیدگاه شما باید بیشتر از 2 کاراکتر باشد!"
    ).isLength({
      min: 3,
    }),
    check("src_id", "آیدی مرجع اشتباه است!").isLength({
      min: 24,
      max: 24,
    }),
    check("parentId", "آیدی کامنت مرجع اشتباه است!").isLength({
      min: 24,
      max: 24,
    }),
  ],
  CommentCtrl.updateComment
);
router.post("/delete-comment/:id", CommentCtrl.deleteComment);
// FOR ADMIN
router.get("/get-comment/:id", CommentCtrl.getOneCommentById);

module.exports = router;
