const { validationResult } = require("express-validator");

const Product = require("../models/Product");
const Category = require("../models/Category");

const getAllProducts = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalProducts = await Product.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          title: 1,
          updatedAt: 1,
          image: 1,
          imageAlt: 1,
          published: 1,
          price: 1,
          typeOfProduct: 1,
          buyNumber: 1,
          pageView: 1,
        });
      const AllProductsNum = await (await Product.find()).length;
      res.status(200).json({ GoalProducts, AllProductsNum });
    } else {
      const AllProducts = await Product.find()
        .sort({ _id: -1 })
        .select({ mainFile: false });
      res.status(200).json(AllProducts);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getAllProducts = getAllProducts;

// THIS RELATED PRODUCTS IS FOR ADD OR UPDATE A PRODUCT
const getRelProducts = async (req, res) => {
  try {
    const AllProducts = await Product.find({ published: true }).select({
      title: 1,
    });
    res.status(200).json(AllProducts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getRelProducts = getRelProducts;

// THIS RELATED CATEGORIES IS FOR ADD OR UPDATE A PRODUCT
const getRelCategoriesOfProducts = async (req, res) => {
  try {
    const AllCategories = await Category.find({ situation: true }).select({
      title: 1,
      slug: 1,
    });
    res.status(200).json(AllCategories);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getRelCategoriesOfProducts = getRelCategoriesOfProducts;

const newProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (
        req.body.image.endsWith(".png") ||
        req.body.image.endsWith(".jpg") ||
        req.body.image.endsWith(".jpeg") ||
        req.body.image.endsWith(".webp")
      ) {
        const theFeatures = req.body.features;
        const featuresError = theFeatures.filter((fe) => !fe.includes(":"));
        const featuresLengthError = theFeatures.filter((fe) => fe.length>45);
        if (featuresError.length > 0) {
          res.status(422).json({ msg: "الگوی ویژگی رعایت نشده است!" });
        } else if(featuresLengthError.length > 0) {
          res.status(422).json({ msg: "حداکثر کاراکتر مجاز برای ویژگی‌ها 45 کاراکتر است!" });
        } else {
          const data = req.body;
          data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
          await Product.create(data);
          res.status(200).json({ msg: "محصول با موفقیت ذخیره شد." });
        }
      } else {
        res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.newProduct = newProduct;

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (
        req.body.image.endsWith(".png") ||
        req.body.image.endsWith(".jpg") ||
        req.body.image.endsWith(".jpeg") ||
        req.body.image.endsWith(".webp")
      ) {
        const theFeatures = req.body.features;
        const featuresError = theFeatures.filter((fe) => !fe.includes(":"));
        const featuresLengthError = theFeatures.filter((fe) => fe.length>45);
        if (featuresError.length > 0) {
          res.status(422).json({ msg: "الگوی ویژگی رعایت نشده است!" });
        } else if(featuresLengthError.length > 0) {
          res.status(422).json({ msg: "حداکثر کاراکتر مجاز برای ویژگی‌ها 45 کاراکتر است!" });
        } else {
          const data = req.body;
          data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
          await Product.findByIdAndUpdate(req.params.id, data, {
            new: true,
          });
          res.status(200).json({ msg: "محصول با موفقیت به روز رسانی شد." });
        }
      } else {
        res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.updateProduct = updateProduct;

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "محصول با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.deleteProduct = deleteProduct;

const getOneProduct = async (req, res) => {
  try {
    const goalProduct = await Product.findOne({ slug: req.params.slug }).select(
      { mainFile: false }
    );
    if (goalProduct.published == true) {
      //INCREASE PAGEVIEW BY 1
      const newProduct = {
        pageView: goalProduct.pageView + 1,
      };
      await Product.findByIdAndUpdate(goalProduct._id, newProduct, {
        new: true,
      });
      res.status(200).json(goalProduct);
    } else {
      res.status(400).json({ msg: "محصول هنوز منتشر نشده است..." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneProduct = getOneProduct;

const getOneProductById = async (req, res) => {
  try {
    const goalProduct = await Product.findById(req.params.id);
    res.status(200).json(goalProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneProductById = getOneProductById;

const getNewProducts = async (req, res) => {
  try {
    const NewApps = await Product.find({
      published: true,
      typeOfProduct: "app",
    })
      .limit(8)
      .sort({ _id: -1 })
      .select({
        title: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        price: 1,
        typeOfProduct: 1,
        pageView: 1,
        buyNumber: 1,
        categories: 1,
      });
    const NewBooks = await Product.find({
      published: true,
      typeOfProduct: "book",
    })
      .limit(8)
      .sort({ _id: -1 })
      .select({
        title: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        price: 1,
        typeOfProduct: 1,
        pageView: 1,
        buyNumber: 1,
        categories: 1,
      });
    const NewGFs = await Product.find({ published: true, typeOfProduct: "gr" })
      .limit(8)
      .sort({ _id: -1 })
      .select({
        title: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        price: 1,
        typeOfProduct: 1,
        features: 1,
        pageView: 1,
        buyNumber: 1,
        categories: 1,
      });
    res.status(200).json({ NewApps, NewBooks, NewGFs });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getNewProducts = getNewProducts;

const getMostViewedProduct = async (req, res) => {
  try {
    const GoalProducts = await Product.find({ published: true })
      .sort({ buyNumber: -1 })
      .limit(3)
      .select({ title: 1, slug: 1 });
    res.status(200).json(GoalProducts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getMostViewedProduct = getMostViewedProduct;

// THIS RELATED PRODUCTS IS FOR SINGLE PRODUCT PAGE
const getRelatedProducts = async (req, res) => {
  try {
    const goalIds = req.body.goalIds;
    const GoalProducts = await Product.find({ _id: goalIds }).select({
      title: 1,
      slug: 1,
      image: 1,
      imageAlt: 1,
      price: 1,
      typeOfProduct: 1,
      features: 1,
      pageView: 1,
      buyNumber: 1,
      categories: 1,
    });
    res.status(200).json(GoalProducts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getRelatedProducts = getRelatedProducts;

const getOneTypeProduct = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalProducts = await Product.find({
        typeOfProduct: req.params.typeOfPro,
      })
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          title: 1,
          updatedAt: 1,
          image: 1,
          imageAlt: 1,
          published: 1,
          price: 1,
          typeOfProduct: 1,
          buyNumber: 1,
          pageView: 1,
        });
      const AllProductsNum = await (
        await Product.find({ typeOfProduct: req.params.typeOfPro })
      ).length;
      res.status(200).json({ GoalProducts, AllProductsNum });
    } else {
      const AllProducts = await Product.find({
        typeOfProduct: req.params.typeOfPro,
      })
        .sort({ _id: -1 })
        .select({ mainFile: false });
      res.status(200).json(AllProducts);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOneTypeProduct = getOneTypeProduct;

const SearchProducts = async (req, res) => {
  try {
    let allProducts = await Product.find({ published: 1 })
      .sort({ _id: -1 })
      .select({
        title: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        price: 1,
        typeOfProduct: 1,
        pageView: 1,
        buyNumber: 1,
        categories: 1,
        features: 1,
        shortDesc: 1,
        tags: 1,
      });

    // KEYWORD SEARCH
    if (req.query.keyword) {
      const theKeyword = req.query.keyword;
      const a = allProducts.filter(
        (pro) =>
          pro.title.replace(/\s+/g,"_").toLowerCase().includes(theKeyword) ||
          pro.imageAlt.replace(/\s+/g,"_").toLowerCase().includes(theKeyword) ||
          pro.shortDesc.replace(/\s+/g,"_").toLowerCase().includes(theKeyword)
      );
      const b=[];
      for(let i=0; i<allProducts.length; i++){
        for(let j=0; j<allProducts[i].tags.length; j++){
          if(allProducts[i].tags[j].includes(theKeyword)){
            b.push(allProducts[i])
          }
        }
      }

      const productSummer=[...a,...b]
      let unique = (item) => [...new Set(item)];
      allProducts = unique(productSummer);
    }

    // ORDERBY price, buyNumber, pageView, date
    if (req.query.orderBy) {
      let a = [];

      if (req.query.orderBy == "price") {
        a = allProducts.sort((a, b) =>
          Number(a.price) > Number(b.price) ? 1 : -1
        );
      } else if (req.query.orderBy == "buyNumber") {
        a = allProducts.sort((a, b) => (a.buyNumber > b.buyNumber ? -1 : 1));
      } else if (req.query.orderBy == "pageView") {
        a = allProducts.sort((a, b) => (a.pageView > b.pageView ? -1 : 1));
      } else {
        a = allProducts;
      }
      allProducts = a;
    }

    // TYPE OF PRODUCT app, book, gr
    if (req.query.type) {
      let a = allProducts.filter((pro) => pro.typeOfProduct == req.query.type);
      allProducts = a;
    }

    // MAX PRICE
    if (req.query.maxP) {
      const a = allProducts.filter(
        (pro) =>
          Number(pro.price) <= req.query.maxP
      );
      allProducts = a;
    }

    // MIN PRICE
    if (req.query.minP) {
      const a = allProducts.filter(
        (pro) =>
          Number(pro.price) >= req.query.minP
      );
      allProducts = a;
    }

    // CATEGORIES
    if (req.query.categories) {
      const a = [];
      const categoriesSlug = req.query.categories.split(",");

      for (let i = 0; i < allProducts.length; i++) {
        for (let j = 0; j < allProducts[i].categories.length; j++) {
          for (let t = 0; t < categoriesSlug.length; t++) {
            if (allProducts[i].categories[j].slug == categoriesSlug[t]) {
              a.push(allProducts[i]);
            }
          }
        }
      }

      let unique = (item) => [...new Set(item)];
      allProducts = unique(a);
    }

    //THIS IS FOR PAGINATION BTNS & SEARCH RESULTS
    const productsNumber = allProducts.length;
    //PAGINATION
    const paginate = req.query.pgn ? req.query.pgn : 12;
    const pageNumber = req.query.pn ? req.query.pn : 1;
    const startNumber = (pageNumber - 1) * paginate;
    const endNumber = paginate * pageNumber;
    const a = [];
    if (paginate >= 0 && pageNumber >= 0) {
      for (let i = startNumber; i < endNumber; i++) {
        if (allProducts[i] != null) {
          a.push(allProducts[i]);
        }
      }
    }
    allProducts = a;

    const allBtns = Array.from(
      Array(Math.ceil(productsNumber / paginate)).keys()
    );
    const btns = [];
    for (let i = 0; i < allBtns.length; i++) {
      if (
        i == 0 ||
        i == allBtns.length - 1 ||
        (i > Number(pageNumber) - 3 && i < Number(pageNumber) + 1)
      ) {
        btns.push(i);
      }
    }

    const outData=[];
    for(let i=0; i<allProducts.length; i++){
      const data=allProducts[i];
      const obj={
        _id:data._id,
        title:data.title,
        slug:data.slug,
        image:data.image,
        imageAlt:data.imageAlt,
        price:data.price,
        typeOfProduct:data.typeOfProduct,
        features:data.features,
        categories:data.categories,
        buyNumber:data.buyNumber,
        pageView:data.pageView,
      };
      outData.push(obj)
    }

    res.status(200).json({ allProducts:outData, btns, productsNumber });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.SearchProducts = SearchProducts;
