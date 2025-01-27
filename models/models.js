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
