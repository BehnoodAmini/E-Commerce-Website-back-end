const { validationResult } = require("express-validator");

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

const getAllNotViewedPayments = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalPayment = await Payment.find({ viewed: false })
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
      const AllPaymentsNum = await (await Payment.find({ viewed: false })).length;
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
module.exports.getAllNotViewedPayments = getAllNotViewedPayments;

const newPayment = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);
    if (!theUser) {
      res.status(401).json({ msg: "کاربر یافت نشد!" });
    } else {
      resnumber = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000); // BECAUSE WE DO NOT HAVE AN AUTHORITY CODE FROM A VALID PAYMENT GATEWAY!
      if (req.body.amount && req.body.amount > 0) {
        const newPaymentBody = {
          username: theUser.username,
          email: theUser.email,
          resnumber: resnumber,
          amount: req.body.amount,
          payed: false,
          products: req.body.products,
          viewed: false,
          createdAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          updatedAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        await Payment.create(newPaymentBody);

        const newUserData = {};
        const thePayment = await Payment.findOne({
          resnumber: newPaymentBody.resnumber,
        });
        // ADDING PAYMENT ID TO USER PAYMENTS
        const userOldPayments = theUser.payments;
        const ThisPayment = [thePayment._id];
        const userNewPayments = [...userOldPayments, ...ThisPayment];
        newUserData.payments = userNewPayments;
        // UPDATE USER
        await User.findByIdAndUpdate(req.user._id, newUserData, { new: true });

        res.status(200).json({ msg: "پرداخت ایجاد شد.", resnumber });
      } else {
        res.status(401).json({ msg: "سبد خرید خالی است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.newPayment = newPayment;

const paymentResultCheck = async (req, res) => {
  try {
    const thePayment = await Payment.findOne({ resnumber: req.body.resnumber });
    if (!thePayment) {
      res.status(401).json({ msg: "پرداخت یافت نشد!" });
    } else {
      if (req.body.payed == true) {
        const theUser = await User.findById(req.user._id);
        const newData = {};

        // ADDING PRODUCTS TO userProducts
        const userOldProducts = theUser.userProducts;
        const userCart = theUser.cart;
        const userNewProducts = [...userOldProducts, ...userCart];
        newData.userProducts = userNewProducts;

        // EMPTY CART
        newData.cart = [];

        // UPDATE USER
        await User.findByIdAndUpdate(req.user._id, newData, { new: true });

        // INCREASE buyNumber BY ONE IN PRODUCT(S)
        for (let i = 0; i < userCart.length; i++) {
          const theProduct = await Product.findById(userCart[i]);
          const newProductData = {
            buyNumber: theProduct.buyNumber + 1,
          };
          await Product.findByIdAndUpdate(userCart[i], newProductData, {
            new: true,
          });
        }

        // UPDATE PAYMENT
        const newPaymentData = {
          payed: true,
          viewed: false,
          updatedAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        await Payment.findByIdAndUpdate(thePayment._id, newPaymentData, {
          new: true,
        });
        res.status(200).json({ msg: "پرداخت انجام شد." });
      } else {
        res.status(401).json({ msg: "پرداخت انجام نشده است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.paymentResultCheck = paymentResultCheck;

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
