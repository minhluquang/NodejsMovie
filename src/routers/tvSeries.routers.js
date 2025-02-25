const express = require("express");
const {
  getPopularTVSeries,
  getDetailTVSeries,
  getAllTVSeriesImages,
  getAllTVSeriesSeasonImages,
  getAllTVSeriesSeasonEpisodeImages,
  getAllTVSeriesVideos,
  getAllTVSeriesSeasonVideos,
  getAllTVSeriesSeasonEpisodeVideos,
  getDetailSeason,
  getDetailEpisode,
} = require("../controllers/tvSeries.controllers");

const tvSeriesRouter = express.Router();

tvSeriesRouter.get("/popular", getPopularTVSeries);
tvSeriesRouter.get("/:id", getDetailTVSeries);
tvSeriesRouter.get("/:id/images", getAllTVSeriesImages);
tvSeriesRouter.get(
  "/:id/season/:season_number/images",
  getAllTVSeriesSeasonImages
);
tvSeriesRouter.get(
  "/:id/season/:season_number/episode/:episode_number/images",
  getAllTVSeriesSeasonEpisodeImages
);
tvSeriesRouter.get("/:id/videos", getAllTVSeriesVideos);
tvSeriesRouter.get(
  "/:id/season/:season_number/videos",
  getAllTVSeriesSeasonVideos
);
tvSeriesRouter.get(
  "/:id/season/:season_number/episode/:episode_number/videos",
  getAllTVSeriesSeasonEpisodeVideos
);
tvSeriesRouter.get("/:id/season/:season_number", getDetailSeason);
tvSeriesRouter.get(
  "/:id/season/:season_number/episode/:episode",
  getDetailEpisode
);

module.exports = { tvSeriesRouter };
