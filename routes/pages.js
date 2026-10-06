import { Router } from "express";
import { join } from "path";

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "..", "public", "index.html"));
});

router.get("/about", (req, res) => {
  res.render("about");
});

export default router;
