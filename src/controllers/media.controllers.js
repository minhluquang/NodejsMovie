const { body, param, validationResult } = require("express-validator");
const {
  getTrendingMediasServices,
  getAllMovieMultiMediaSerices,
  getAllTVSeriesMultiMediaServices,
  getVideoTrailersServices,
  addFavoriteServices,
  getMediaInteractionStatusByAccountIdServices,
  deleteFavoriteServices,
  getMediaByKeywordServices,
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

// Add favorite
const addFavorite = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await addFavoriteServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get rating by account_id and media_id
const getMediaInteractionStatusByAccountId = async (req, res) => {
  try {
    const { id, type } = req.params;
    const accountId = req.user.id;
    const result = await getMediaInteractionStatusByAccountIdServices(
      accountId,
      id,
      type
    );
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Delete favorite
const deleteFavorite = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await deleteFavoriteServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get media by keyword
const getMediaByKeyword = async (req, res) => {
  try {
    const { keyword } = req.query;
    const result = await getMediaByKeywordServices(keyword);
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
  addFavorite,
  getMediaInteractionStatusByAccountId,
  deleteFavorite,
  getMediaByKeyword,
};
