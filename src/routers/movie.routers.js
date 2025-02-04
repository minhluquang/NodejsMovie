const express = require("express");
const {
  getTrendingMovies,
  getUpcomingMovies,
} = require("../controllers/movie.controllers");

const movieRouter = express.Router();

movieRouter.get("/trending/:type", getTrendingMovies);
movieRouter.get("/upcoming", getUpcomingMovies);

module.exports = { movieRouter };
