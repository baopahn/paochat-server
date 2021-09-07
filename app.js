const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { configPassport, checkAuth } = require("./src/components/auth/passport");
const { connectDB } = require("./src/database");
const indexRouter = require("./src/components/index");
const authRouter = require("./src/components/auth");
const userRouter = require("./src/components/user");
const chatRouter = require("./src/components/chat");

const app = express();
app.use(cors());
configPassport();
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", checkAuth(), userRouter);
app.use("/chat", checkAuth(), chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
