const express = require("express");
const router = express();
const { check } = require("express-validator");

const ProductCtrl = require("../controllers/ProductCtrl");

router.get("/products", ProductCtrl.getAllProducts);
// THIS RELATED PRODUCT IS FOR ADD OR UPDATE A PRODUCT
router.get("/products-rel", ProductCtrl.getRelProducts);
router.post(
  "/new-product",
  [
    check(
      "title",
      "تعداد کاراکتر عنوان محصول باید بیشتر از 5 کاراکتر باشد!"
    ).isLength({
      min: 5,
    }),
    check("published", "فرمت بخش انتشار اشتباه است!").isBoolean(),
    check("relatedProducts", "فرمت بخش محصولات مرتبط اشتباه است!").isArray(),
    check("typeOfProduct", "تعداد کاراکتر بخش تایپ محصول اشتباه است!").isLength(
      { min: 2, max: 4 }
    ),
  ],
  ProductCtrl.newProduct
);
router.post(
  "/update-product/:id",
  [
    check(
      "title",
      "تعداد کاراکتر عنوان محصول باید بیشتر از 5 کاراکتر باشد!"
    ).isLength({
      min: 5,
    }),
    check("published", "فرمت بخش انتشار اشتباه است!").isBoolean(),
    check("relatedProducts", "فرمت بخش محصولات مرتبط اشتباه است!").isArray(),
    check("typeOfProduct", "تعداد کاراکتر بخش تایپ محصول اشتباه است!").isLength(
      { min: 2, max: 4 }
    ),
  ],
  ProductCtrl.updateProduct
);
router.post("/delete-product/:id", ProductCtrl.deleteProduct);
router.get("/get-product/:slug", ProductCtrl.getOneProduct);
router.get("/get-product-by-id/:id", ProductCtrl.getOneProductById);
router.get("/get-new-products", ProductCtrl.getNewProducts);
router.get("/get-most-viewed-products", ProductCtrl.getMostViewedProduct);
// THIS RELATED productS IS FOR SINGLE PRODUCT PAGE
router.post("/get-related-products", ProductCtrl.getRelatedProducts);

module.exports = router;
