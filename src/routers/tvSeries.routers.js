const express = require("express");
const {
  getPopularTVSeries,
  getDetailTVSeries,
  getAllTVSeriesImages,
  getAllTVSeriesSeasonImages,
} = require("../controllers/tvSeries.controllers");

const tvSeriesRouter = express.Router();

tvSeriesRouter.get("/popular", getPopularTVSeries);
tvSeriesRouter.get("/:id", getDetailTVSeries);
tvSeriesRouter.get("/:id/images", getAllTVSeriesImages);
tvSeriesRouter.get(
  "/:id/season/:season_number/images",
  getAllTVSeriesSeasonImages
);

module.exports = { tvSeriesRouter };
