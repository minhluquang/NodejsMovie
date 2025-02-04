const { getPopularTVSeriesServices } = require("../services/tvSeries.services");
const { body, param, validationResult } = require("express-validator");

// Get movie trending (today/this week)
const getPopularTVSeries = async (req, res) => {
  const { type } = req.params;
  try {
    const result = await getPopularTVSeriesServices(type);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getPopularTVSeries,
};
