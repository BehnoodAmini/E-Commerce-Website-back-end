const express = require("express");
const router = express();
const { check } = require("express-validator");

const CommentCtrl = require("../controllers/CommentCtrl");
const userExist = require("../middlewares/userExist");
const isAdmin = require("../middlewares/isAdmin");

router.get("/comments", isAdmin, CommentCtrl.getAllComments);
router.get(
  "/not-viewed-comments",
  isAdmin,
  CommentCtrl.getAllNotViewedComments
);
router.post(
  "/new-comment",
  userExist,
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
  isAdmin,
  CommentCtrl.updateComment
);
router.post("/delete-comment/:id", isAdmin, CommentCtrl.deleteComment);
router.get("/get-comment/:id", isAdmin, CommentCtrl.getOneCommentById); // FOR ADMIN
router.post("/get-model-comments", CommentCtrl.getModelComments);
router.get("/get-comment-childrens/:id", CommentCtrl.getCommentChildrens);
router.post("/publish-comment", isAdmin, CommentCtrl.publishComment);
router.get(
  "/get-model-comments-number/:id",
  CommentCtrl.getModelCommentsNumber
);

module.exports = router;
