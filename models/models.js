const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");

exports.fetchEndPoints = () => {
  return endpointsJson;
};

exports.fetchTopics = () => {
  let SQLString = "SELECT * FROM topics";
  return db
    .query(SQLString)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error("Database error:", err);
      throw err;
    });
};

exports.fetchArticleFromArticleId = (id) => {
  let SQLString = `SELECT * FROM articles WHERE article_id = ${id}`;
  return db.query(SQLString).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject();
    } else {
      return result.rows;
    }
  });
};

exports.fetchArticles = () => {
  let SQLString = "SELECT * FROM articles";
  return db.query(SQLString).then((result) => {
    if (result.length === 0) {
      return Promise.reject();
    } else {
      return result.rows;
    }
  });
};

exports.fetchArticleComments = (id) => {
  let SQLString = `SELECT * FROM comments JOIN articles ON articles.article_id = comments.article_id where articles.article_id = ${id}`;
  return db.query(SQLString).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject();
    } else {
      return result.rows;
    }
  });
};
