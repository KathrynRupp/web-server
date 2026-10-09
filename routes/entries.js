import { Router } from "express";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { Ok, Err, Some, None } from "../result.js";

const router = Router();

//absolute path to entries data
const ENTRIES_FILE = join(import.meta.dirname, "..", "entries.json");

//async handler for rejected promises
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

//validate entries
const validateEntry = ({ title, body }) => {
  if (!title || !body) return Err("title and body are required");
  return Ok({ title, body });
};

//find entry by id
const findEntryById = (entries, id) => {
  const entry = entries[id];
  return entry ? Some(entry) : None;
};

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
  const result = validateEntry(req.body);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  const entries = await readEntries();
  entries.push(result.value);
  await writeEntries(entries);
  res.status(201).json(result.value);
});

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const entries = await readEntries();

    const found = findEntryById(entries, id);
    if (!found.some) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    const result = validateEntry(req.body);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }

    entries[id] = result.value;
    await writeEntries(entries);
    res.status(200).json(result.value);
  }),
);

//DELETE: remove an entry by its position in the array
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id); //url params are always strings
  const entries = await readEntries();

  const found = findEntryById(entries, id);
  //sanity check on deletion
  if (!found.some) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  entries.splice(id, 1); //shift later entries down 1
  await writeEntries(entries);
  res.status(204).send(); //success, no body
});

export default router;
