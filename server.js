import express from "express";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api.js";

// initialize app object and set port
const app = express();
const PORT = process.env.port || 3000;

//routes
app.use("/", pagesRouter);
app.use("/api", apiRouter);

//tell express to use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

//entries route finds entries.ejs templates
//passes it a data object (title and array)
app.get("/entries", (req, res) => {
  const entries = [{ title: "First note" }, { title: "Second note" }];
  res.render("layout", { title: "Entries", page: "entries", entries });
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
