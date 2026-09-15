import { Router } from "express";

const router = Router();

const projects = [
  { name: "Weather app", tag: "javascript" },
  { name: "Portfolio site", tag: "express" },
  { name: "Budget tracker", tag: "python" },
];

router.get("/", (req, res) => {
  res.send("Home page");
});

/*
router.get("/projects", (req, res) => {
  const tag = req.query.tag || "";
  const name = req.query.name || "";
  const matchingProjects = projects
    .filter((project) => project.name === name)
    .filter((project) => project.tag === tag);

  if (tag === "" && name === "") {
    res.json(projects);
  } else if (tag === "") {
    res.json(projects.filter((project) => project.name === name));
  } else if (name === "") {
    res.json(projects.filter((project) => project.tag === tag));
  } else {
    res.json(matchingProjects);
  }
});
*/

router.get("/about", (req, res) => {
  res.send("About page");
});

export default router;
