const { validationResult } = require("express-validator");

const User = require("../models/User");
const Product = require("../models/Product");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const getAllComments = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalComments = await Comment.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          email: 1,
          parentId: 1,
          published: 1,
          viewed: 1,
          createdAt: 1,
        });
      const AllCommentsNum = await (await Comment.find()).length;
      res.status(200).json({ GoalComments, AllCommentsNum });
    } else {
      const AllComments = await Comment.find()
        .sort({ _id: -1 })
        .select({ resnumber: false });
      res.status(200).json(AllComments);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getAllComments = getAllComments;

const newComment = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);
    if (!theUser) {
      res.status(401).json({ msg: "کاربر یافت نشد!" });
    } else {
      if (theUser.userIsActive == false) {
        res.status(401).json({ msg: "لطفا ابتدا ایمیل خود را تایید کنید!" });
      } else {
        const commentData = {
          message: req.body.message,
          email: theUser.email,
          displayname: theUser.displayname,
          src_id: req.body.src_id,
          parentId: req.body.parentId,
          typeOfModel: req.body.typeOfModel,
          published: false,
          viewed: false,
          createdAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        await Comment.create(commentData);
        res.status(200).json({ msg: "دیدگاه شما پس از بررسی منتشر خواهد شد!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.newComment = newComment;

const updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      const data = req.body;
      data.displayname = req.body.displayname.replace(/\s+/g, "_").toLowerCase();
      data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
      await Comment.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({ msg: "دیدگاه با موفقیت به روز رسانی شد." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.updateComment = updateComment;

const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "دیدگاه با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.deleteComment = deleteComment;

const getOneCommentById = async (req, res) => {
  try {
    const goalComment = await Comment.findById(req.params.id);

    // ADDING SOURCE PRODUCTS OR POSTS TO THE COMMENT
    goalComment.src={};
    if(goalComment.typeOfModel=="post"){
      goalComment.src=await Post.findById(goalComment.src_id).select({title:1,slug:1});
    } else {
      goalComment.src=await Product.findById(goalComment.src_id).select({title:1,slug:1});
    }

    // ADDING PARENT COMMENT
    goalComment.parent={};
    if(goalComment.parentId==null){
      goalComment.parent={};
    } else {
      goalComment.parent=await Comment.findById(goalComment.parentId).select({message:1,email:1,displayname:1,createdAt:1,});
    }

    res.status(200).json(goalComment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneCommentById = getOneCommentById;
