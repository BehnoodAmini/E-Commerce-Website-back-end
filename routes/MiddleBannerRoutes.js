const express = require("express");
const router = express();
const { check } = require("express-validator");

const MiddleBannerCtrl = require("../controllers/MiddleBannerCtrl");

const isAdmin = require("../middlewares/isAdmin");

router.get("/middle-banners",isAdmin, MiddleBannerCtrl.getAllMidBan);
router.post(
  "/new-middle-banner",
  [
    check(
      "imageAlt",
      "تعداد کاراکتر alt تصویر باید بیشتر از 8 کاراکتر باشد!"
    ).isLength({ min: 8 }),
    check("situation", "فرمت بخش انتشار اشتباه است!").isBoolean(),
  ],
  isAdmin,
  MiddleBannerCtrl.newMidBan
);
router.post(
  "/update-middle-banner/:id",
  [
    check(
      "imageAlt",
      "تعداد کاراکتر alt تصویر باید بیشتر از 8 کاراکتر باشد!"
    ).isLength({ min: 8 }),
    check("situation", "فرمت بخش انتشار اشتباه است!").isBoolean(),
  ],
  isAdmin,
  MiddleBannerCtrl.updateMidBan
);
router.post("/delete-middle-banner/:id", isAdmin, MiddleBannerCtrl.deleteMidBan);
router.get("/get-mid-ban/:id",isAdmin, MiddleBannerCtrl.getOneMidBan);
router.get("/get-active-mid-bans", MiddleBannerCtrl.getActiveBanners);

module.exports = router;
