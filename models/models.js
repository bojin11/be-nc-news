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

exports.postComment = (article_id, author, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [article_id, author, body]
    )
    .catch((err) => {
      console.error("Database error:", err);
      throw err;
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(
      `DELETE from comments
      WHERE comment_id = $1
      RETURNING *;`,
      [comment_id]
    )
    .catch((err) => {
      console.error("Database error:", err);
      throw err;
    });
};

exports.fetchUsers = () => {
  return db
    .query("SELECT * FROM users")
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error("Database error:", err);
      throw err;
    });
};
