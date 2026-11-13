//import dependencies
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import entriesRouter from "./routes/entries.js";
import authRouter from "./routes/auth.js";
import { attachUser } from "./middleware/attachUser.js";

// initialize app object and set port
const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET =
  process.env.SESSION_SECRET || "dev-secret-change-in-production";

//connect to database
await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

//tell express to use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

//middleware
app.use(express.static("public")); //serve public routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//loggers
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(morgan("dev"));
app.use(cookieParser(SESSION_SECRET));
app.use(attachUser);

//route
app.use(authRouter);
app.use("/entries", entriesRouter);

//page not found
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

//error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});

//server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// stable checkpoint
