const MiddleBanner = require("../models/MiddleBanner");

const getAllMidBan = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 2;
      const pageNumber = req.query.pn;
      const GoalMidBans = await MiddleBanner.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllMidBansNum = await (await MiddleBanner.find()).length;
      res.status(200).json({ GoalMidBans, AllMidBansNum });
    } else {
      const AllMidBans = await MiddleBanner.find();
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
    const newMidBanner = new MiddleBanner({
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      situation: req.body.situation,
      link: req.body.link,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    newMidBanner
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

const updateMidBan = async (req, res) => {
  try {
    await MiddleBanner.updateOne(
      { _id: req.body.goalId },
      {
        $set: {
          image: req.body.image,
          imageAlt: req.body.imageAlt,
          situation: req.body.situation,
          link: req.body.link,
          date: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      }
    );
    res.status(200).json({ msg: "بنر میانی با موفقیت به روز رسانی شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error" });
  }
};
module.exports.updateMidBan = updateMidBan;

const deleteMidBan = async (req, res) => {
  try {
    await MiddleBanner.deleteOne({ _id: req.body.goalId });
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
