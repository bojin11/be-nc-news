const express = require("express");
const {
  getEndPoints,
  getTopics,
  getArticleFromArticleId,
  getArticles,
  getArticleComments,
  addComment,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api", getEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleFromArticleId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", addComment);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
