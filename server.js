//import dependencies
import express from "express";
import morgan from "morgan";

//import routes
import pagesRouter from "./routes/pages.js";
import entriesRouter from "./routes/entries.js";

// initialize app object and set port
const app = express();
const PORT = process.env.PORT || 3000;

//tell express to use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

//middleware
app.use(express.static("public")); //serve public routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  //logger
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(morgan("dev"));

//routes
app.use("/", pagesRouter);
app.use("/entries", entriesRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
