const {
  fetchEndPoints,
  fetchTopics,
  fetchArticleFromArticleId,
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
