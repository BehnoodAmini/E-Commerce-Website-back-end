const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Product = require("../models/Product");

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

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      // CHECK PASSWORD AND CONFIRM PASSWORD
      if (req.body.password == req.body.rePassword) {
        const emailExist = await User.find({ email: req.body.email });
        // CHECK EMAIL EXIST
        if (emailExist.length < 1) {
          const usernameExist = await User.find({
            username: req.body.username,
          });
          // CHECK USERNAME EXIST
          if (usernameExist.length < 1) {
            // MAKING USER
            const data = req.body;
            data.username = req.body.username
              .replace(/\s+/g, "_")
              .toLowerCase();
            data.displayname = req.body.displayname
              .replace(/\s+/g, "_")
              .toLowerCase();
            data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
            data.password = req.body.password.replace(/\s+/g, "").toLowerCase();
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userActivateCode = Math.floor(
              Math.random() * 90000000 + 10000000
            );
            const newUser = new User({
              username: data.username,
              displayname: data.displayname,
              email: data.email,
              password: hashedPassword,
              favoriteProducts: [],
              userProducts: [],
              comments: [],
              payments: [],
              cart: [],
              viewed: false,
              activateCode: userActivateCode,
              userIsActive: false,
              emailSend: true,
              createdAt: new Date().toLocaleDateString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              updatedAt: new Date().toLocaleDateString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
            newUser
              .save()
              .then((d) => {
                // MAKING AUTH COOKIE
                const token = jwt.sign(
                  { _id: newUser._id, username: newUser.username },
                  process.env.TOKEN_SECRET
                );

                // EMAIL TO USER
                const MAIL_HOST = process.env.MAIL_HOST;
                const MAIL_PORT = process.env.MAIL_PORT;
                const MAIL_USER = process.env.MAIL_USER;
                const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
                const MAIL_MAIN_ADDRESS = process.env.MAIL_MAIN_ADDRESS;
                const transporter = nodemailer.createTransport({
                  host: MAIL_HOST,
                  port: MAIL_PORT,
                  tls: true,
                  auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASSWORD,
                  },
                });
                transporter
                  .sendMail({
                    from: MAIL_MAIN_ADDRESS,
                    to: newUser.email,
                    subject: "احراز هویت pdshop.ir",
                    html: `<html><head><style>strong{color: rgb(0, 121, 222);}h1{font-size: large;}</style></head><body><h1>احراز هویت pdshop.ir</h1><div>کد احراز هویت: <strong>${userActivateCode}</strong></div></body></html>`,
                  })
                  .then((d) => {
                    res
                      .status(200)
                      .json({ msg: "ثبت نام موفقیت آمیز بود.", auth: token });
                  })
                  .catch((err) => {
                    console.log(err);
                    res
                      .status(400)
                      .json({ msg: "خطا در ثبت نام!", errorMessage: err });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json(err);
              });
          } else {
            res.status(422).json({ msg: "لطفا نام کاربری دیگری وارد کنید!" });
          }
        } else {
          res.status(422).json({ msg: "لطفا ایمیل دیگری وارد کنید!" });
        }
      } else {
        res.status(422).json({ msg: "تکرار رمز عبور اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.registerUser = registerUser;

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      // CHECK EMAIL EXIST
      const emailExist = await User.find({ email: req.body.email });
      if (emailExist.length > 0) {
        const theUser = emailExist[0];
        const data = req.body;
        data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
        data.password = req.body.password.replace(/\s+/g, "").toLowerCase();
        const validPassword = await bcrypt.compare(
          data.password,
          theUser.password
        );
        if (validPassword == false) {
          res.status(422).json({ msg: "ایمیل یا رمز عبور اشتباه است!" });
        } else {
          // MAKING AUTH COOKIE
          const token = jwt.sign(
            { _id: theUser._id, username: theUser.username },
            process.env.TOKEN_SECRET
          );
          res
            .status(200)
            .json({ msg: "با موفقیت وارد حساب کاربری شدید.", auth: token });
        }
      } else {
        res.status(422).json({ msg: "لطفا ابتدا ثبت نام کنید!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.loginUser = loginUser;

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
      const newPass = req.body.password.replace(/\s+/g, "").toLowerCase();
      data.password = await bcrypt.hash(newPass, 10);
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
        if (req.body.password == req.body.rePassword) {
          const data = req.body;
          data.displayname = req.body.displayname
            .replace(/\s+/g, "_")
            .toLowerCase();
          const newPass = req.body.password.replace(/\s+/g, "").toLowerCase();
          data.password = await bcrypt.hash(newPass, 10);
          (data.updatedAt = new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })),
            await User.findByIdAndUpdate(req.params.id, data, {
              new: true,
            });
          res.status(200).json({ msg: "کاربر با موفقیت به روز رسانی شد." });
        } else {
          res.status(422).json({ msg: "تکرار رمز عبور اشتباه است!" });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.miniUpdateUser = miniUpdateUser;

const emailSenderChanger = async (req, res) => {
  try {
    const newUser = {
      updatedAt: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      emailSend: req.body.emailSend,
    };
    await User.findByIdAndUpdate(req.user._id, newUser, {
      new: true,
    });
    res.status(200).json({ msg: "وضعیت ارسال ایمیل تغییر کرد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.emailSenderChanger = emailSenderChanger;

const confirmEmail = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);
    if (theUser.activateCode == req.body.activateCode) {
      const newUser = {
        updatedAt: new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        userIsActive: true,
      };
      await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
      });
      res.status(200).json({ msg: "حساب کاربری با موفقیت فعال شد." });
    } else {
      res.status(401).json({ msg: "کد تایید اشتباه است." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.confirmEmail = confirmEmail;

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

const getUserDataAccount = async (req, res) => {
  try {
    const goalUser = await User.findById(req.user._id);
    res.status(200).json(goalUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getUserDataAccount = getUserDataAccount;

const getPartOfUserData = async (req, res) => {
  try {
    const theSlug = req.params.slug;
    if (theSlug == "info") {
      const goalUser = await User.findById(req.user._id).select({
        username: 1,
        displayname: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        emailSend: 1,
        userIsActive: 1,
      });
      res.status(200).json(goalUser);
    } else if (theSlug == "favourites") {
      const goalUser = await User.findById(req.user._id).select({
        favoriteProducts: 1,
      });
      const goalProducts = await Product.find({
        _id: { $in: goalUser.favoriteProducts },
      }).select({
        title: 1,
        slug: 1,
        image: 1,
        price: 1,
        shortDesc: 1,
        typeOfProduct: 1,
        features: 1,
        buyNumber: 1,
      });
      res.status(200).json(goalProducts);
    } else if (theSlug == "purchased") {
      const goalUser = await User.findById(req.user._id).select({
        userProducts: 1,
      });
      res.status(200).json(goalUser);
    } else if (theSlug == "comments") {
      const goalUser = await User.findById(req.user._id).select({
        comments: 1,
      });
      res.status(200).json(goalUser);
    } else if (theSlug == "payments") {
      const goalUser = await User.findById(req.user._id).select({
        payments: 1,
      });
      res.status(200).json(goalUser);
    } else {
      res.status(200).json({ msg: "عدم تعیین بخش مورد نظر..." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getPartOfUserData = getPartOfUserData;

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

const favouriteProductsMan = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);
    if (req.body.method == "push") {
      const newUserFavProducts = [
        ...theUser.favoriteProducts,
        req.body.newFavProduct,
      ];
      const newUser = {
        favoriteProducts: newUserFavProducts,
      };
      await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
      });
      res.status(200).json({ msg: "به محصولات مورد علاقه افزوده شد!" });
    } else if (req.body.method == "remove") {
      const oldFavProducts = theUser.favoriteProducts;
      for (let i = 0; i < oldFavProducts.length; i++) {
        if (oldFavProducts[i]._id == goalFavProductId) {
          let updatedUserFav = oldFavProducts;
          if (i > -1) {
            updatedUserFav.splice(i, 1);
          }
          const updatedFavProduct = { favoriteProducts: updatedUserFav };
          await User.findByIdAndUpdate(req.user._id, updatedFavProduct, {
            new: true,
          });
        }
      }
      res.status(200).json({ msg: "از محصولات مورد علاقه حذف شد!" });
    } else {
      res.status(401).json({ msg: "خطا در ارسال اطلاعات محصولات مورد علاقه!" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.favouriteProductsMan = favouriteProductsMan;
