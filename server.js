import express from "express";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api.js";
import entriesRouter from "./routes/entries.js";

// initialize app object and set port
const app = express();
const PORT = process.env.port || 3000;

//tell express to use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());

//slow route with async
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/slow", async (req, res) => {
  await wait(5000);
  res.send("Done waiting");
});

//routes
app.use("/", pagesRouter);
app.use("/api", apiRouter);
app.use("/entries", entriesRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
