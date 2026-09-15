import express from "express";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api.js";

// initialize app object and set port
const app = express();
const PORT = process.env.port || 3000;

app.use("/", pagesRouter);
app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
