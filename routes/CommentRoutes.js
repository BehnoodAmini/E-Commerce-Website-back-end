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
  ],
  CommentCtrl.updateComment
);
router.post("/delete-comment/:id", CommentCtrl.deleteComment);
router.get("/get-comment/:id", CommentCtrl.getOneCommentById); // FOR ADMIN
router.post("/get-model-comments", CommentCtrl.getModelComments);
router.post("/get-comment-childrens", CommentCtrl.getCommentChildrens);
router.post("/publish-comment", CommentCtrl.publishComment);

module.exports = router;
