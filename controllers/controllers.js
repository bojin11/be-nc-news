const comments = require("../db/data/test-data/comments");
const {
  fetchEndPoints,
  fetchTopics,
  fetchArticleFromArticleId,
  fetchArticles,
  fetchArticleComments,
  postComment,
  updateArticleById,
} = require("../models/models");

exports.getEndPoints = (req, res) => {
  const result = fetchEndPoints();
  res.send({ endpoints: result });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.send({ topics: result });
    })
    .catch((err) => {
      console.error("Error fetching topics:", err);
      next(err);
    });
};

exports.getArticleFromArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleFromArticleId(article_id)
    .then((result) => {
      res.send({ article: result });
    })
    .catch((err) => {
      res.status(404).send({ msg: "article does not exist" });
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((result) => {
      res.send({ articles: result });
    })
    .catch((err) => {
      console.error("Error fetching articles:", err);
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleComments(article_id)
    .then((result) => {
      res.send({ comments: result });
    })
    .catch((err) => {
      res.status(404).send({ msg: "article does not exist" });
    });
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { author, body } = req.body || {};

  if (!author || !body) {
    return res
      .status(400)
      .send({ status: 400, msg: "author and body are required" });
  }
  postComment(article_id, author, body)
    .then(() => {
      res.status(201).send({
        comment: { author: author, body: body },
      });
    })
    .catch((err) => {
      console.error("Error posting comment", err);
      next(err);
    });
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return res
      .status(400)
      .json({ error: "Bad Request: inc_votes must be a number" });
  }

  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.status(200).json({ article: updatedArticle });
    })
    .catch(next);
};
