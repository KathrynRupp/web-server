import { Router } from "express";
import { join } from "path";

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "..", "public", "index.html"));
});

router.get("/about", (req, res) => {
  res.render("about");
});

//slow route with async
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/slow", async (req, res) => {
  await wait(5000);
  res.send("Done waiting");
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
