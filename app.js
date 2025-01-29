const express = require("express");
const {
  getEndPoints,
  getTopics,
  getArticleFromArticleId,
  getArticles,
  getArticleComments,
  addComment,
  updateArticleVotes,
  deleteCommentById,
  getUsers,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api", getEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleFromArticleId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", addComment);
app.patch("/api/articles/:article_id", updateArticleVotes);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
