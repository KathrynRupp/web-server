import { Router } from "express";
import { join } from "path";

const router = Router();

//for /projects
const projects = [
  { name: "Weather app", tag: "javascript" },
  { name: "Portfolio site", tag: "express" },
  { name: "Budget tracker", tag: "python" },
];

router.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "..", "public", "index.html"));
});

//entries route finds entries.ejs templates
//passes it a data object (title and array)
router.get("/entries", (req, res) => {
  const entries = [{ title: "First note" }, { title: "Second note" }];
  res.render("layout", { title: "Entries", page: "entries", entries });
});

//req.params example using multiple parameters
router.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
  res.send(`User ${userId}, post ${postId}`);
});

//filter by matching tags, names, or either; or return list if no query
router.get("/projects", (req, res) => {
  const { tag, name } = req.query;

  const matchingProjects = projects.filter(
    (project) =>
      (!tag || project.tag === tag) && (!name || project.name === name),
  );

  res.json(matchingProjects);
});

router.get("/about", (req, res) => {
  res.send("About page");
});

export default router;
