const express = require("express");
const router = express();
const { check } = require("express-validator");

const SliderCtrl = require("../controllers/SliderCtrl");

const isAdmin = require("../middlewares/isAdmin");

router.get("/sliders", isAdmin, SliderCtrl.getAllSliders);
router.post(
  "/new-slider",
  [
    check(
      "imageAlt",
      "تعداد کاراکتر alt تصویر باید بیشتر از 8 کاراکتر باشد!"
    ).isLength({ min: 8 }),
    check("situation", "فرمت بخش انتشار اشتباه است!").isBoolean(),
    check("sorter", "فرمت بخش سورتر اشتباه است!").isNumeric(),
  ],
  isAdmin,
  SliderCtrl.newSlider
);
router.post(
  "/update-slider/:id",
  [
    check(
      "imageAlt",
      "تعداد کاراکتر alt تصویر باید بیشتر از 8 کاراکتر باشد!"
    ).isLength({ min: 8 }),
    check("situation", "فرمت بخش انتشار اشتباه است!").isBoolean(),
    check("sorter", "فرمت بخش سورتر اشتباه است!").isNumeric(),
  ],
  isAdmin,
  SliderCtrl.updateSlider
);
router.post("/delete-slider/:id", isAdmin, SliderCtrl.deleteSlider);
router.get("/get-slider/:id", isAdmin, SliderCtrl.getOneSlider);
router.get("/get-active-sliders", SliderCtrl.getActiveSlider);

module.exports = router;
