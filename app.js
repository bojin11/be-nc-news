const express = require("express");
const {
  getEndPoints,
  getTopics,
  getArticleFromArticleId,
} = require("./controllers/controllers");
const app = express();

app.get("/api", getEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleFromArticleId);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

// app.use((err, req, res, next) => {
//   if (err.code === "42703") {
//     res.status(404).send({ msg: "article does not exist" });
//   }
// });

module.exports = app;
