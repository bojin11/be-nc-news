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

exports.fetchArticleFromArticleId = (article_id) => {
  const SQLString = `
  SELECT 
    a.article_id,
    a.title, 
    a.topic, 
    a.author, 
    a.body, 
    a.created_at, 
    a.votes, 
    a.article_img_url, 
    COUNT(c.comment_id) AS comment_count
  FROM 
    articles a
  LEFT JOIN 
    comments c 
  ON 
    a.article_id = c.article_id
  WHERE 
    a.article_id = $1
  GROUP BY 
    a.article_id;
`;
  const values = [article_id];
  return db.query(SQLString, values).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject();
    } else {
      return result.rows;
    }
  });
};

// exports.fetchArticles = ({ sort_by = "created_at", order = "desc", topic }) => {
//   let SQLString = "SELECT * FROM articles";
//   args = [];

//   if (topic) {
//     SQLString += ` WHERE topic = $2`;
//     args.push(topic);
//   }

//   const greenList = [
//     "title",
//     "topic",
//     "author",
//     "body",
//     "created_at",
//     "votes",
//     "article_img_url",
//   ];

//   if (greenList.includes(sort_by)) {
//     SQLString += ` ORDER BY $1 ${order === "desc" ? "DESC" : "ASC"}`;
//     args.unshift(sort_by);
//   }

//   return db.query(SQLString, args).then((result) => {
//     if (result.length === 0) {
//       return Promise.reject();
//     } else {
//       return result.rows;
//     }
//   });
// };

exports.fetchArticles = ({ sort_by = "created_at", order = "desc", topic }) => {
  let SQLString = `SELECT * FROM articles`;
  const args = [];

  if (topic) {
    SQLString += ` WHERE topic = $1`;
    args.push(topic);
  }

  const greenList = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];

  if (greenList.includes(sort_by)) {
    SQLString += ` ORDER BY ${sort_by} ${order === "desc" ? "DESC" : "ASC"}`;
  } else {
    SQLString += ` ORDER BY created_at DESC`;
  }

  return db.query(SQLString, args).then((result) => {
    if (result.rows.length === 0) {
      return [];
    } else {
      return result.rows;
    }
  });
};

exports.fetchArticleComments = (article_id) => {
  let SQLString = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id FROM comments JOIN articles ON articles.article_id = comments.article_id where articles.article_id = $1`;
  const values = [article_id];
  return db.query(SQLString, values).then((result) => {
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
