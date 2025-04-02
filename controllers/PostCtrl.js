const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalPosts = await Post.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllPostsNum = await (await Post.find()).length;
      res.status(200).json({ GoalPosts, AllPostsNum });
    } else {
      const AllPosts = await Post.find();
      res.status(200).json(AllPosts);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getAllPosts = getAllPosts;

const newPost = async (req, res) => {
  try {
    await Post.create(req.body);
    res.status(200).json({ msg: "مقاله با موفقیت ذخیره شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.newPost = newPost;

const updatePost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ msg: "مقاله با موفقیت به روز رسانی شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.updatePost = updatePost;

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "مقاله با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.deletePost = deletePost;

const getOnePost = async (req, res) => {
  try {
    const goalPost = await Post.findOne({ slug: req.params.slug });
    //INCREASE PAGEVIEW BY 1
    const newPost = {
      pageView: goalPost.pageView + 1,
    };
    await Post.findByIdAndUpdate(goalPost._id, newPost, {
      new: true,
    });
    res.status(200).json(goalPost);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getOnePost = getOnePost;

const getNewPosts = async (req, res) => {
  try {
    const ActivePost = await Post.find({ situation: true }).select({
      title: 1,
      UpdatedAt: 1,
      slug: 1,
      image: 1,
      imageAlt: 1,
      shortDesc: 1,
      type: 1,
      pageView: 1,
    });
    res.status(200).json(ActivePost);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getNewPosts = getNewPosts;
