const express = require("express");
const {
  getPopularTVSeries,
  getDetailTVSeries,
} = require("../controllers/tvSeries.controllers");

const tvSeriesRouter = express.Router();

tvSeriesRouter.get("/popular", getPopularTVSeries);
tvSeriesRouter.get("/:id", getDetailTVSeries);

module.exports = { tvSeriesRouter };
