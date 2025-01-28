const express = require("express");
const {
  getEndPoints,
  getTopics,
  getArticleFromArticleId,
  getArticles,
  getArticleComments,
} = require("./controllers/controllers");
const app = express();

app.get("/api", getEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleFromArticleId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
