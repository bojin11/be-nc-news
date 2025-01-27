const { fetchEndPoints } = require("../models/models");

exports.getEndPoints = (req, res) => {
  const result = fetchEndPoints();
  res.send({ endpoints: result });
};
