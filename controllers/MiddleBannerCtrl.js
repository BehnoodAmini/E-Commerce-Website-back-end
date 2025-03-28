const MiddleBanner = require("../models/MiddleBanner");

const getAllMidBan = async (req, res) => {
  try {
    const AllMidBans = await MiddleBanner.find();
    res.status(200).json(AllMidBans);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.getAllMidBan = getAllMidBan;

const newMidBan = async (req, res) => {
  try {
    const newMidBan = new MiddleBanner({
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      situation: req.body.situation,
      link: req.body.link,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    newMidBan
      .save()
      .then((d) => {
        res.status(200).json({ msg: "بنر میانی با موفقیت ذخیره شد." });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ msg: "خطا در ذخیره بنر میانی" });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};

module.exports.newMidBan = newMidBan;
