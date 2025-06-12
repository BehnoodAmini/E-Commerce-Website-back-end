const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Product = require("../models/Product");
const Payment = require("../models/Payment");

const getAllPayments = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalPayment = await Payment.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          email: 1,
          amount: 1,
          payed: 1,
          viewed: 1,
          updatedAt: 1,
        });
      const AllPaymentsNum = await (await Payment.find()).length;
      res.status(200).json({ GoalPayment, AllPaymentsNum });
    } else {
      const AllPayments = await Payment.find()
        .sort({ _id: -1 })
        .select({ resnumber: false });
      res.status(200).json(AllPayments);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getAllPayments = getAllPayments;

const updatePayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      const data = req.body;
      data.username = req.body.username.replace(/\s+/g, "_").toLowerCase();
      data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
      await Payment.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({ msg: "پرداخت با موفقیت به روز رسانی شد." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.updatePayment = updatePayment;

const deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "پرداخت با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.deletePayment = deletePayment;

const getOnePaymentById = async (req, res) => {
  try {
    const goalPayment = await Payment.findById(req.params.id);
    // FOR ADDING PRODUCTS TO GOALPAYMENT
    const goalPaymentProduct = await Product.find({
      _id: { $in: goalPayment.products },
    }).select({ title: 1, slug: 1 });
    goalPayment.products = goalPaymentProduct;
    
    res.status(200).json(goalPayment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOnePaymentById = getOnePaymentById;

