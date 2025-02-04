const express = require("express");
const { getPopularTVSeries } = require("../controllers/tvSeries.controllers");

const tvSeriesRouter = express.Router();

tvSeriesRouter.get("/popular", getPopularTVSeries);

module.exports = { tvSeriesRouter };
