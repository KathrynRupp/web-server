import { Router } from "express";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";

const router = Router();

//absolute path to entries data
const ENTRIES_FILE = join(import.meta.dirname, "..", "entries.json");

//read and write to entries data with async functions
const readEntries = async () => {
  const data = await readFile(ENTRIES_FILE, "utf-8");
  return JSON.parse(data);
};

const writeEntries = async (entries) => {
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));
};

//GET: render the entries page
router.get("/", async (req, res) => {
  const entries = await readEntries();
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

//POST: create an entry from the JSON body (needs express.json() middleware)
router.post("/", async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({ error: "title and body are required" });
    return; //sending a message doesn't stop the function
  }
  const entries = await readEntries();
  const newEntry = { title, body };
  entries.push(newEntry);
  await writeEntries(entries);
  res.status(201).json(newEntry);
});

//DELETE: remove an entry by its position in the array
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id); //url params are always strings
  const entries = await readEntries();
  //sanity check on deletion
  if (Number.isNaN(id) || id < 0 || id >= entries.length) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  entries.splice(id, 1); //shift later entries down 1
  await writeEntries(entries);
  res.status(204).send(); //success, no body
});

export default router;
