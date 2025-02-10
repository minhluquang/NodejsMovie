const express = require("express");
const {
  getTrendingMovies,
  getUpcomingMovies,
  getDetailMovie,
} = require("../controllers/movie.controllers");

const movieRouter = express.Router();

movieRouter.get("/trending/:type", getTrendingMovies);
movieRouter.get("/upcoming", getUpcomingMovies);
movieRouter.get("/:id", getDetailMovie);

module.exports = { movieRouter };
