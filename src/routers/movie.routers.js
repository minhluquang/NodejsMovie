const express = require("express");
const {
  getTrendingMovies,
  getUpcomingMovies,
  getDetailMovie,
  getAllMovieImages,
  getAllMovieVideos,
  getAllMovieCredits,
} = require("../controllers/movie.controllers");

const movieRouter = express.Router();

movieRouter.get("/trending/:type", getTrendingMovies);
movieRouter.get("/upcoming", getUpcomingMovies);
movieRouter.get("/:id", getDetailMovie);
movieRouter.get("/:id/images", getAllMovieImages);
movieRouter.get("/:id/videos", getAllMovieVideos);
movieRouter.get("/:id/credits", getAllMovieCredits);

module.exports = { movieRouter };
