const express = require('express');
const router = express();

const PostCtrl = require("../controllers/PostCtrl");

router.get("/posts", PostCtrl.getAllPosts);
router.get("/posts-rel", PostCtrl.getRelPosts);
router.post("/new-post", PostCtrl.newPost);
router.post("/update-post/:id", PostCtrl.updatePost);
router.post("/delete-post/:id", PostCtrl.deletePost);
router.get("/get-post/:slug", PostCtrl.getOnePost);
router.get("/get-new-posts", PostCtrl.getNewPosts);

module.exports = router;
