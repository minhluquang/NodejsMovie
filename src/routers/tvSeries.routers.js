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
  getTVSeriresCredits,
  getTVEpisodeCredits,
  getTVSeasonCredits,
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
tvSeriesRouter.get("/:id/credits", getTVSeriresCredits);
tvSeriesRouter.get(
  "/:id/season/:season_number/episode/:episode/credits",
  getTVEpisodeCredits
);
tvSeriesRouter.get("/:id/season/:season_number/credits", getTVSeasonCredits);

module.exports = { tvSeriesRouter };
