import { Router } from "express";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";

const router = Router();

//get file
const ENTRIES_FILE = join(import.meta.dirname, "..", "entries.json");

//read and write async functions
const readEntries = async () => {
  const data = await readFile(ENTRIES_FILE, "utf-8");
  return JSON.parse(data);
};

const writeEntries = async (entries) => {
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));
};

router.get("/", async (req, res) => {
  const entries = await readEntries();
  res.set("Cache-Control", "public, max-age=60");
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

router.post("/", async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({ error: "title and body are required" });
    return;
  }
  const entries = await readEntries();
  const newEntry = { title, body };
  entries.push(newEntry);
  await writeEntries(entries);
  res.status(201).json(newEntry);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const entries = await readEntries();
  if (Number.isNaN(id) || id < 0 || id >= entries.length) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  entries.splice(id, 1);
  await writeEntries(entries);
  res.status(204).send();
});

router.get("/random-post", async (req, res) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post = await response.json();
  res.status(200).json(post);
});

router.get("/three-posts", async (req, res) => {
  const ids = [1, 2, 3];
  const titles = [];
  for (const id of ids) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    const post = await response.json();
    titles.push(post.title);
  }
  res.status(200).json({ titles });
});

export default router;
