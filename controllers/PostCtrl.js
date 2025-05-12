const { validationResult } = require("express-validator");

const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalPosts = await Post.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          title: 1,
          UpdatedAt: 1,
          image: 1,
          imageAlt: 1,
          published: 1,
          pageView: 1,
        });
      const AllPostsNum = await (await Post.find()).length;
      res.status(200).json({ GoalPosts, AllPostsNum });
    } else {
      const AllPosts = await Post.find().sort({ _id: -1 });
      res.status(200).json(AllPosts);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getAllPosts = getAllPosts;

// THIS RELATED POST IS FOR ADD OR UPDATE A BLOG
const getRelPosts = async (req, res) => {
  try {
    const AllPosts = await Post.find({ published: true }).select({ title: 1 });
    res.status(200).json(AllPosts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getRelPosts = getRelPosts;

const newPost = async (req, res) => {
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
        const data = req.body;
        data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        await Post.create(data);
        res.status(200).json({ msg: "مقاله با موفقیت ذخیره شد." });
      } else {
        res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.newPost = newPost;

const updatePost = async (req, res) => {
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
        const data = req.body;
        data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        await Post.findByIdAndUpdate(req.params.id, data, {
          new: true,
        });
        res.status(200).json({ msg: "مقاله با موفقیت به روز رسانی شد." });
      } else {
        res.status(422).json({ msg: "فرمت عکس اشتباه است!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.updatePost = updatePost;

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "مقاله با موفقیت حذف شد." });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.deletePost = deletePost;

const getOnePost = async (req, res) => {
  try {
    const goalPost = await Post.findOne({ slug: req.params.slug });
    if (goalPost.published == true) {
      //INCREASE PAGEVIEW BY 1
      const newPost = {
        pageView: goalPost.pageView + 1,
      };
      await Post.findByIdAndUpdate(goalPost._id, newPost, {
        new: true,
      });
      res.status(200).json(goalPost);
    } else {
      res.status(400).json({ msg: "مقاله هنوز منتشر نشده است..." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOnePost = getOnePost;

const getOnePostById = async (req, res) => {
  try {
    const goalPost = await Post.findById(req.params.id);
    res.status(200).json(goalPost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getOnePostById = getOnePostById;

const getNewPosts = async (req, res) => {
  try {
    const ActivePost = await Post.find({ published: true })
      .limit(4)
      .sort({ _id: -1 })
      .select({
        title: 1,
        UpdatedAt: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        shortDesc: 1,
        type: 1,
        pageView: 1,
      });
    res.status(200).json(ActivePost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getNewPosts = getNewPosts;

const getMostViewed = async (req, res) => {
  try {
    const GoalPosts = await Post.find({ published: true })
      .sort({ pageView: -1 })
      .limit(3)
      .select({ title: 1, slug: 1 });
    res.status(200).json(GoalPosts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getMostViewed = getMostViewed;

// THIS RELATED POSTS IS FOR SINGLE BLOG PAGE
const getRelatedPosts = async (req, res) => {
  try {
    const goalIds = req.body.goalIds;
    const GoalPosts = await Post.find({ _id: goalIds }).select({
      title: 1,
      UpdatedAt: 1,
      slug: 1,
      image: 1,
      imageAlt: 1,
      shortDesc: 1,
      type: 1,
      pageView: 1,
    });
    res.status(200).json(GoalPosts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports.getRelatedPosts = getRelatedPosts;

const SearchPosts = async (req, res) => {
  try {
      let allPosts = await Post.find({ published: 1 })
        .sort({ _id: -1 })
        .select({
          title: 1,
          slug: 1,
          image: 1,
          imageAlt: 1,
          UpdatedAt: 1,
          shortDesc: 1,
          tags: 1,
          pageView: 1,
        });
  
      // KEYWORD SEARCH
      if (req.query.keyword) {
        const theKeyword = req.query.keyword;
        const a = allPosts.filter(
          (pro) =>
            pro.title.replace(/\s+/g,"_").toLowerCase().includes(theKeyword) ||
            pro.imageAlt.replace(/\s+/g,"_").toLowerCase().includes(theKeyword) ||
            pro.shortDesc.replace(/\s+/g,"_").toLowerCase().includes(theKeyword)
        );
        const b=[];
        for(let i=0; i<allPosts.length; i++){
          for(let j=0; j<allPosts[i].tags.length; j++){
            if(allPosts[i].tags[j].includes(theKeyword)){
              b.push(allPosts[i])
            }
          }
        }
  
        const postsSummer=[...a,...b]
        let unique = (item) => [...new Set(item)];
        allPosts = unique(postsSummer);
      }
  
      //THIS IS FOR PAGINATION BTNS & SEARCH RESULTS
      const postsNumber = allPosts.length;
      //PAGINATION
      const paginate = req.query.pgn ? req.query.pgn : 12;
      const pageNumber = req.query.pn ? req.query.pn : 1;
      const startNumber = (pageNumber - 1) * paginate;
      const endNumber = paginate * pageNumber;
      const a = [];
      if (paginate >= 0 && pageNumber >= 0) {
        for (let i = startNumber; i < endNumber; i++) {
          if (allPosts[i] != null) {
            a.push(allPosts[i]);
          }
        }
      }
      allPosts = a;
  
      const allBtns = Array.from(
        Array(Math.ceil(postsNumber / paginate)).keys()
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
      for(let i=0; i<allPosts.length; i++){
        const data=allPosts[i];
        const obj={
          _id:data._id,
          title:data.title,
          slug:data.slug,
          image:data.image,
          imageAlt:data.imageAlt,
          UpdatedAt:data.UpdatedAt,
          shortDesc:data.shortDesc,
          pageView:data.pageView,
        };
        outData.push(obj)
      }
  
      res.status(200).json({ allPosts:outData, btns, postsNumber });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
};
module.exports.SearchPosts = SearchPosts;