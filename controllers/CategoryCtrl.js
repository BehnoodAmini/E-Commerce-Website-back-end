const { validationResult } = require("express-validator");

const Category = require("../models/Category");

const getAllCategories = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalCategories = await Category.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          image: 1,
          imageAlt: 1,
          title: 1,
          situation: 1,
          typeOfProduct: 1,
        });
      const AllCategoriesNum = await (await Category.find()).length;
      res.status(200).json({ GoalCategories, AllCategoriesNum });
    } else {
      const AllCategories = await Category.find().sort({ _id: -1 });
      res.status(200).json(AllCategories);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getAllCategories = getAllCategories;

const newCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (
        req.body.image.endsWith(".png") ||
        req.body.image.endsWith(".jpg") ||
        req.body.image.endsWith(".jpeg") ||
        req.body.image.endsWith(".webp")
      ) {
        await Category.create(req.body);
        res.status(200).json({ msg: "دسته بندی با موفقیت ذخیره شد." });
      } else {
        res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.newCategory = newCategory;

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (
        req.body.image.endsWith(".png") ||
        req.body.image.endsWith(".jpg") ||
        req.body.image.endsWith(".jpeg") ||
        req.body.image.endsWith(".webp")
      ) {
        await Category.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        res.status(200).json({ msg: "دسته بندی با موفقیت به روز رسانی شد." });
      } else {
        res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.updateCategory = updateCategory;

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "دسته بندی با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.deleteCategory = deleteCategory;

const getOneCategory = async (req, res) => {
  try {
    const goalCategory = await Category.findById(req.params.id);
    res.status(200).json(goalCategory);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneCategory = getOneCategory;

const getMainPageCategories = async (req, res) => {
  try {
    const ActiveCategories = await Category.find({ situation: true }).select({
      image: 1,
      imageAlt: 1,
      slug: 1,
      title: 1,
      shortDesc: 1,
      typeOfProduct: 1,
    });
    res.status(200).json(ActiveCategories);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getMainPageCategories = getMainPageCategories;

const getOneCategoryBySlug = async (req, res) => {
  try {
    const goalCatrgory = await Category.findOne({ slug: req.params.slug });
    if (goalCatrgory.situation == true) {
      res.status(200).json(goalCatrgory);
    } else {
      res.status(400).json({ msg: "دسته هنوز منتشر نشده است..." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneCategoryBySlug = getOneCategoryBySlug;
