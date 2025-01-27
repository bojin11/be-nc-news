const express = require("express");
const { getEndPoints } = require("./controllers/controllers");
const app = express();

app.get("/api", getEndPoints);

module.exports = app;
