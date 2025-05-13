const { validationResult } = require("express-validator");

const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalUsers = await User.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          username: 1,
          displayname: 1,
          email: 1,
          viewed: 1,
          userIsActive: 1,
          createdAt: 1,
        });
      const AllUsersNum = await (await User.find()).length;
      res.status(200).json({ GoalUsers, AllUsersNum });
    } else {
      const AllUsers = await User.find().sort({ _id: -1 });
      res.status(200).json(AllUsers);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getAllUsers = getAllUsers;

// REGISTER
// const newPost = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(422).json({ msg: errors.errors[0].msg });
//     } else {
//       if (
//         req.body.image.endsWith(".png") ||
//         req.body.image.endsWith(".jpg") ||
//         req.body.image.endsWith(".jpeg") ||
//         req.body.image.endsWith(".webp")
//       ) {
//         const data = req.body;
//         data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
//         await Post.create(data);
//         res.status(200).json({ msg: "مقاله با موفقیت ذخیره شد." });
//       } else {
//         res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(err);
//   }
// };
// module.exports.newPost = newPost;

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      const data = req.body;
      data.username = req.body.username.replace(/\s+/g, "_").toLowerCase();
      data.displayname = req.body.displayname
        .replace(/\s+/g, "_")
        .toLowerCase();
      data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
      data.password = req.body.password.replace(/\s+/g, "").toLowerCase();
      await User.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({ msg: "کاربر با موفقیت به روز رسانی شد." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.updateUser = updateUser;

const miniUpdateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (
        req.body.username ||
        req.body.email ||
        req.body.payments ||
        req.body.userProducts ||
        req.body.viewed ||
        req.body.activateCode ||
        req.body.userIsActive
      ) {
        res.status(400).json({ msg: "خطا در اطلاعات فرستاده شده!" });
      } else {
        const data = req.body;
        data.displayname = req.body.displayname
          .replace(/\s+/g, "_")
          .toLowerCase();
        data.password = req.body.password.replace(/\s+/g, "").toLowerCase();
        await User.findByIdAndUpdate(req.params.id, data, {
          new: true,
        });
        res.status(200).json({ msg: "کاربر با موفقیت به روز رسانی شد." });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.miniUpdateUser = miniUpdateUser;

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "کاربر با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.deleteUser = deleteUser;

const getOneUserById = async (req, res) => {
  try {
    const goalUser = await User.findById(req.params.id);
    res.status(200).json(goalUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneUserById = getOneUserById;

const SearchUsers = async (req, res) => {
  try {
    const theUser = await User.find({ email: req.body.email });
    if (theUser.length > 0) {
      res.status(200).json({ userData: theUser[0] });
    } else {
      res.status(200).json({ userData: 0 });
    }

    res.status(200).json({ allPosts: outData, btns, postsNumber });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.SearchUsers = SearchUsers;
