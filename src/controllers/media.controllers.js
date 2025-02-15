const { body, param, validationResult } = require("express-validator");
const {
  getTrendingMediasServices,
  getAllMovieMultiMediaSerices,
  getAllTVSeriesMultiMediaServices,
  getVideoTrailersServices,
} = require("../services/media.services");

// Get movie trending (today/this week)
const getTrendingMedias = [
  param("type")
    .isIn(["today", "week"])
    .withMessage(
      "Invalid 'type' value. Accepted values are 'today' or 'week'."
    ),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        data: errors.array(),
      });
    }

    const { type } = req.params;
    try {
      const result = await getTrendingMediasServices(type);
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// Get all video & image of movie by movie_id
const getAllMovieMultiMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllMovieMultiMediaSerices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get all video & image of tv by tv_series_id
const getAllTVSeriesMultiMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllTVSeriesMultiMediaServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get video trailer for home page
const getVideoTrailers = async (req, res) => {
  try {
    const result = await getVideoTrailersServices();
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getTrendingMedias,
  getAllMovieMultiMedia,
  getAllTVSeriesMultiMedia,
  getVideoTrailers,
};
