const express = require('express');
const router = express();

const MiddleBannerCtrl = require("../controllers/MiddleBannerCtrl");

router.get("/middle-banners", MiddleBannerCtrl.getAllMidBan);
router.post("/new-middle-banner", MiddleBannerCtrl.newMidBan);
router.post("/update-middle-banner/:id", MiddleBannerCtrl.updateMidBan);
router.post("/delete-middle-banner/:id", MiddleBannerCtrl.deleteMidBan);
router.get("/get-mid-ban/:id", MiddleBannerCtrl.getOneMidBan);
router.get("/get-active-mid-bans", MiddleBannerCtrl.getActiveBanners);

module.exports = router;
