const express = require("express");
const router = express();
const { check } = require("express-validator");

const CategoryCtrl = require("../controllers/CategoryCtrl");
const Category = require("../models/Category");

router.get("/categories", CategoryCtrl.getAllCategories);
router.post(
  "/new-category",
  [
    check(
      "imageAlt",
      "تعداد کاراکتر alt تصویر باید بیشتر از 8 کاراکتر باشد!"
    ).isLength({ min: 8 }),
    check("title", "تعداد کاراکتر عنوان باید 5 تا 30 کاراکتر باشد!").isLength({
      min: 5,
      max: 30,
    }),
    check(
      "shortDesc",
      "تعداد کاراکتر توضیحات کوتاه باید 5 تا 60 کاراکتر باشد!"
    ).isLength({ min: 5, max: 60 }),
    check("situation", "فرمت بخش انتشار اشتباه است!").isBoolean(),
    check("slug", "لطفا اسلاگ دیگری انتخاب کنید...").custom((value) => {
      return Category.find({
        slug: value,
      }).then((category) => {
        if (category.length > 0) {
          throw "لطفا اسلاگ دیگری انتخاب کنید...";
        }
      });
    }),
  ],
  CategoryCtrl.newCategory
);
router.post(
  "/update-category/:id",
  [
    check(
      "imageAlt",
      "تعداد کاراکتر alt تصویر باید بیشتر از 8 کاراکتر باشد!"
    ).isLength({ min: 8 }),
    check("title", "تعداد کاراکتر عنوان باید 5 تا 30 کاراکتر باشد!").isLength({
      min: 5,
      max: 30,
    }),
    check(
      "shortDesc",
      "تعداد کاراکتر توضیحات کوتاه باید 5 تا 60 کاراکتر باشد!"
    ).isLength({ min: 5, max: 60 }),
    check("situation", "فرمت بخش انتشار اشتباه است!").isBoolean(),
    check("slug", "لطفا اسلاگ دیگری انتخاب کنید...").custom((value) => {
      return Category.find({
        slug: value,
      }).then((category) => {
        if (category.length > 1) {
          throw "لطفا اسلاگ دیگری انتخاب کنید...";
        }
      });
    }),
  ],
  CategoryCtrl.updateCategory
);
router.post("/delete-category/:id", CategoryCtrl.deleteCategory);
router.get("/get-category/:id", CategoryCtrl.getOneCategory);
router.get("/get-active-categories", CategoryCtrl.getMainPageCategories);
router.get("/get-category/:slug", CategoryCtrl.getOneCategoryBySlug);

module.exports = router;
