const express = require("express");
const router = express();
const { check } = require("express-validator");

const PaymentCtrl = require("../controllers/PaymentCtrl");
const UserExist = require("../middlewares/userExist")

router.get("/payments", PaymentCtrl.getAllPayments);
router.post("/new-payment", UserExist, PaymentCtrl.newPayment);
router.post("/payment-result-check", UserExist, PaymentCtrl.paymentResultCheck);
router.post(
  "/update-payment/:id",
  [
    check(
      "username",
      "تعداد کاراکتر نام کاربری باید از 8 تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
    check("amount", "فرمت مبلغ اشتباه است!").isNumeric(),
    check("payed", "فرمت وضعیت پرداخت اشتباه است!").isBoolean(),
    check("products", "فرمت محصولات قابل پرداخت اشتباه است!").isArray(),
    check("viewed", "فرمت چک شدن اشتباه است!").isBoolean(),
  ],
  PaymentCtrl.updatePayment
);
router.post("/delete-payment/:id", PaymentCtrl.deletePayment);
// FOR ADMIN
router.get("/get-payment/:id", PaymentCtrl.getOnePaymentById);

module.exports = router;
