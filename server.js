import express from "express";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api.js";

// initialize app object and set port
const app = express();
const PORT = process.env.port || 3000;

//tell express to use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());

//entries data and routes
const entries = [
  { title: "First note", body: "Notes from the first session" },
  { title: "Second note", body: "Notes from the second session" },
  { title: "Third note", body: "Notes from the third session" },
];

app.get("/entries", (req, res) => {
  const accept = req.get("Accept");
  console.log(accept);
  res.set("Cache-Control", "public, max-age=60");
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

app.post("/entries", (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({ error: "title and body are required" });
    return;
  }
  const newEntry = { title, body };
  entries.push(newEntry);
  res.status(201).json(newEntry);
});

app.delete("/entries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id) || id < 0 || id >= entries.length) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  entries.splice(id, 1);
  res.status(204).send();
});

//routes
app.use("/", pagesRouter);
app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
