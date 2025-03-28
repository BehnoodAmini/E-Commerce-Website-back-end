const express = require('express');
const router = express();

const MiddleBannerCtrl = require("../controllers/MiddleBannerCtrl");

router.get("/middle-banners", MiddleBannerCtrl.getAllMidBan);
router.post("/new-middle-banner", MiddleBannerCtrl.newMidBan);

module.exports = router;
