const express = require("express");
const { getEndPoints, getTopics } = require("./controllers/controllers");
const app = express();

app.get("/api", getEndPoints);
app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
