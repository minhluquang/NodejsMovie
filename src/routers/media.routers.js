const express = require("express");
const {
  getTrendingMedias,
  getAllMovieMultiMedia,
  getAllTVSeriesMultiMedia,
  getVideoTrailers,
} = require("../controllers/media.controllers");

const mediaRouter = express.Router();

mediaRouter.get("/trending/:type", getTrendingMedias);
mediaRouter.get("/movie/:id/multimedia", getAllMovieMultiMedia);
mediaRouter.get("/tv/:id/multimedia", getAllTVSeriesMultiMedia);
mediaRouter.get("/video-trailers", getVideoTrailers);

module.exports = { mediaRouter };
