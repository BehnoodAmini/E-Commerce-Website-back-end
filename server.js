const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

// security
const helmet = require("helmet");
const xssCleaner = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// mid
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(xssCleaner());
app.use(mongoSanitize());
app.use(hpp());

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "this is file shop server...",
  });
});

//ROUTES
const midBanRoutes = require("./routes/MiddleBannerRoutes");
const postRoutes = require("./routes/PostRoutes");
const sliderRoutes = require("./routes/SliderRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");

//ROUTES MIDDLEWARE
app.use("/api", midBanRoutes);
app.use("/api", postRoutes);
app.use("/api", sliderRoutes);
app.use("/api", CategoryRoutes);

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

//mongoose.connect(DB_URL)
mongoose
  .connect("mongodb://127.0.0.1:27017/")
  .then((d) => {
    console.log("ok");
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
