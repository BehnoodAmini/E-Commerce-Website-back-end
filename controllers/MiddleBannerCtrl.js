const MiddleBanner = require("../models/MiddleBanner");

const getAllMidBan = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalMidBans = await MiddleBanner.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllMidBansNum = await (await MiddleBanner.find()).length;
      res.status(200).json({ GoalMidBans, AllMidBansNum });
    } else {
      const AllMidBans = await MiddleBanner.find().sort({ _id: -1 });
      res.status(200).json(AllMidBans);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getAllMidBan = getAllMidBan;

const newMidBan = async (req, res) => {
  try {
    await MiddleBanner.create(req.body);
    res.status(200).json({ msg: "بنر میانی با موفقیت ذخیره شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.newMidBan = newMidBan;

const updateMidBan = async (req, res) => {
  try {
    await MiddleBanner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ msg: "بنر میانی با موفقیت به روز رسانی شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.updateMidBan = updateMidBan;

const deleteMidBan = async (req, res) => {
  try {
    await MiddleBanner.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "بنر میانی با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.deleteMidBan = deleteMidBan;

const getOneMidBan = async (req, res) => {
  try {
    const goalMidBan = await MiddleBanner.findById(req.params.id);
    res.status(200).json(goalMidBan);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getOneMidBan = getOneMidBan;

const getActiveBanners = async (req, res) => {
  try {
    const ActiveBanners = await MiddleBanner.find({ situation: true }).select({
      image: 1,
      imageAlt: 1,
      link: 1,
    });
    res.status(200).json(ActiveBanners);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getActiveBanners = getActiveBanners;
