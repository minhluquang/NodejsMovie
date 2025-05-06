const { Op } = require("sequelize");
const {
  Movie,
  tvSeries,
  tvSeason,
  MovieImage,
  MovieVideo,
  TVSeriesImage,
  TVSeriesVideo,
  WatchlistMovie,
  WatchlistTVSeries,
  FavoriteMovie,
  FavoriteTVSeries,
  RatingMovie,
  RatingTVSeries,
  sequelize,
} = require("../models");
const {
  getLastAirEpisode,
  getNextAirEpisode,
  getNextAirSeasons,
} = require("./tvSeason.services");
const _ = require("lodash");

const getTrendingMediasServices = async (type) => {
  try {
    let trendingTVSeries = [];
    let trendingMovies = [];

    if (type === "today") {
      // Trending TV Series
      const thisWeekTVSeries = await tvSeries.findAll({
        include: {
          model: tvSeason,
          where: {
            air_date: {
              [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
              [Op.lte]: new Date(), // <= today
            },
          },
        },
        order: [
          [tvSeason, "season_number", "desc"],
          ["popularity", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],

        limit: 20,
      });

      var sortTVSeason = thisWeekTVSeries.sort((a, b) => {
        return (
          new Date(b.tvSeasons[0].air_date) - new Date(a.tvSeasons[0].air_date)
        );
      });

      sortTVSeason = sortTVSeason.sort((a, b) => {
        return (
          new Date(b.tvSeasons[0].vote_average) -
          new Date(a.tvSeasons[0].vote_average)
        );
      });

      trendingTVSeries = trendingTVSeries.map((series) => {
        let plainSeries = series.get({ plain: true });
        delete plainSeries.tvSeasons;
        return {
          ...plainSeries,
          media_type: "tv",
        };
      });

      if (trendingTVSeries.length < 20) {
        const lastYearTVSeries = await tvSeries.findAll({
          include: {
            model: tvSeason,
            where: {
              air_date: {
                [Op.gte]: new Date(
                  new Date().setDate(new Date().getDate() - 7)
                ),
                [Op.lte]: new Date(), // <= today
              },
            },
          },
          order: [
            [tvSeason, "season_number", "desc"],
            ["popularity", "desc"],
            ["vote_count", "desc"],
            ["vote_average", "desc"],
          ],

          limit: 20 - trendingTVSeries.length,
        });

        trendingTVSeries = trendingTVSeries.map((series) => {
          let plainSeries = series.get({ plain: true });
          delete plainSeries.tvSeasons;
          return {
            ...plainSeries,
            media_type: "tv",
          };
        });
      }

      // Trending Movies
      const thisWeekMovies = await Movie.findAll({
        where: {
          release_date: {
            [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)), // >= 7 days ago
            [Op.lte]: new Date(), // <= today
          },
        },
        order: [
          ["popularity", "desc"],
          ["release_date", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],
        limit: 20,
      });

      trendingMovies = thisWeekMovies.map((movie) => ({
        ...movie.get({ plain: true }),
        media_type: "movie",
      }));

      if (trendingMovies.length < 20) {
        const lastYearMovies = await Movie.findAll({
          where: {
            release_date: {
              [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 7)), // <= 7 days ago
              [Op.gte]: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1) // >= a year ago
              ),
            },
          },
          order: [
            ["popularity", "desc"],
            ["release_date", "desc"],
            ["vote_count", "desc"],
            ["vote_average", "desc"],
          ],
          limit: 20 - trendingMovies.length,
        });

        trendingMovies = trendingMovies.concat(
          lastYearMovies.map((movie) => ({
            ...movie.get({ plain: true }),
            media_type: "movie",
          }))
        );
      }
    } else {
      // Trending TV Series
      trendingTVSeries = await tvSeries.findAll({
        include: {
          model: tvSeason,
          where: {
            air_date: {
              [Op.lte]: new Date(), // <= today
            },
          },
        },
        order: [
          [tvSeason, "season_number", "desc"],
          ["popularity", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],
        limit: 20,
      });

      trendingTVSeries = trendingTVSeries.map((series) => {
        let plainSeries = series.get({ plain: true });
        delete plainSeries.tvSeasons;
        return {
          ...plainSeries,
          media_type: "tv",
        };
      });

      // Trending Movies
      trendingMovies = await Movie.findAll({
        where: {
          release_date: { [Op.lte]: new Date() },
        },
        order: [
          ["popularity", "desc"],
          ["release_date", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],
        limit: 20,
      });

      trendingMovies = trendingMovies.map((movie) => ({
        ...movie.get({ plain: true }),
        media_type: "movie",
      }));
    }

    const trendingMedias = [...trendingTVSeries, ...trendingMovies];
    const sortByPopularity = (a, b) => b.popularity - a.popularity;
    const sortByReleaseDate = (a, b) => {
      const dateA = new Date(
        a.media_type === "movie" ? a.release_date : a.tvSeasons?.[0]?.air_date
      );
      const dateB = new Date(
        b.media_type === "movie" ? b.release_date : b.tvSeasons?.[0]?.air_date
      );
      return dateB - dateA;
    };
    const sortByVoteCount = (a, b) => b.vote_count - a.vote_count;
    const sortByVoteAverage = (a, b) => b.vote_average - a.vote_average;

    trendingMedias.sort(sortByPopularity);
    trendingMedias.sort(sortByReleaseDate);
    trendingMedias.sort(sortByVoteCount);
    trendingMedias.sort(sortByVoteAverage);

    const slicedTrendingMedias = trendingMedias.slice(0, 20);

    return { success: true, code: 200, data: slicedTrendingMedias };
  } catch (error) {
    throw error;
  }
};

const getAllMovieMultiMediaSerices = async (movie_id) => {
  try {
    // Get images
    const movieImages = await MovieImage.findAll({ where: { movie_id } });
    const groupedImages = movieImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) acc[type] = [];
      const {
        aspect_ratio,
        iso_639_1,
        height,
        width,
        file_path,
        vote_average,
        vote_count,
      } = image.dataValues;
      acc[type].push({
        aspect_ratio,
        iso_639_1,
        height,
        width,
        file_path,
        vote_average,
        vote_count,
      });
      return acc;
    }, {});

    // Get videos
    let movieVideos = await MovieVideo.findAll({ where: { movie_id } });
    movieVideos = movieVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    if (!movieImages.length && !movieVideos.length) {
      return {
        success: true,
        code: 200,
        data: { msg: "No media found." },
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        images: groupedImages,
        videos: movieVideos,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getAllTVSeriesMultiMediaServices = async (tv_series_id) => {
  try {
    // Get images
    const tvSeriesImages = await TVSeriesImage.findAll({
      where: { tv_series_id, season: null, episode: null },
    });

    const groupedImages = tvSeriesImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) acc[type] = [];
      const {
        aspect_ratio,
        height,
        width,
        iso_639_1,
        file_path,
        vote_average,
        vote_count,
      } = image.dataValues;
      acc[type].push({
        aspect_ratio,
        height,
        width,
        iso_639_1,
        file_path,
        vote_average,
        vote_count,
      });
      return acc;
    }, {});

    // Get videos
    let tvSeriesVideos = await TVSeriesVideo.findAll({
      where: { tv_series_id, season: null, episode: null },
    });

    tvSeriesVideos = tvSeriesVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    if (!tvSeriesImages.length && !tvSeriesVideos.length) {
      return {
        success: true,
        code: 200,
        data: { msg: "No media found." },
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        images: groupedImages,
        videos: tvSeriesVideos,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getVideoTrailersServices = async () => {
  try {
    let movieVideoTrailer = await MovieVideo.findAll({
      where: { site: "Youtube", type: "Trailer", official: 1 },
      include: {
        model: Movie,
      },
    });

    let tvSeriesTrailer = await TVSeriesVideo.findAll({
      where: { site: "Youtube", type: "Trailer", official: 1 },
      include: {
        model: tvSeries,
      },
    });

    if (!movieVideoTrailer.length && !tvSeriesTrailer.length) {
      return {
        success: true,
        code: 200,
        data: { msg: "No video trailer found." },
      };
    }

    // remove attributes not use in movieVideoTrailer
    movieVideoTrailer = movieVideoTrailer.map((k) => ({
      key: k.video_key,
      name: k.name,
      site: k.site,
      type: k.type,
      published_at: k.published_at,
      id: k.movie_id,
      backdrop_path: k.Movie.backdrop_path,
      title: k.Movie.title,
      original_title: k.Movie.original_title,
      popularity: k.Movie.popularity,
      vote_average: k.Movie.vote_average,
      vote_count: k.Movie.vote_count,
      media_type: "movie",
    }));

    // remove attributes not use in tvSeriesTrailer
    tvSeriesTrailer = tvSeriesTrailer.map((k) => ({
      key: k.video_key,
      name: k.name,
      site: k.site,
      type: k.type,
      published_at: k.published_at,
      id: k.tv_series_id,
      backdrop_path: k.tvSery.backdrop_path,
      title: k.tvSery.name,
      original_title: k.tvSery.original_name,
      popularity: k.tvSery.popularity,
      vote_average: k.tvSery.vote_average,
      vote_count: k.tvSery.vote_count,
      media_type: "tv",
    }));

    let combinedTrailers = [...movieVideoTrailer, ...tvSeriesTrailer];
    combinedTrailers = _.chain(combinedTrailers)
      .orderBy(["published_at"], ["desc"])
      .uniqBy("id")
      .orderBy(
        ["popularity", "vote_count", "vote_average"],
        ["desc", "desc", "desc"]
      )
      .take(20)
      .value();

    return {
      success: true,
      code: 200,
      data: [...combinedTrailers],
    };
  } catch (error) {
    throw error;
  }
};

// Add watchlist services
const addWatchlistServices = async (id, type, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const movie = await Movie.findOne({ where: { movie_id: id } });
      if (!movie) {
        return { success: false, code: 404, data: { msg: "Movie not found" } };
      }

      const isExistMovieInWatchlist = await WatchlistMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });

      if (isExistMovieInWatchlist) {
        return {
          success: false,
          code: 409,
          data: { msg: "Movie already in watchlist" },
        };
      }

      const newWatchlistMovie = new WatchlistMovie({
        account_id: accountId,
        movie_id: id,
        added_at: new Date(),
      });
      await newWatchlistMovie.save({ transaction });
    } else if (type === "tv") {
      const tv = await tvSeries.findOne({ where: { tv_series_id: id } });
      if (!tv) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found" },
        };
      }
      const isExistTVInWatchlist = await WatchlistTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });

      if (isExistTVInWatchlist) {
        return {
          success: false,
          code: 409,
          data: { msg: "TV Series already in watchlist" },
        };
      }

      const newWatchlistTVSeries = new WatchlistTVSeries({
        account_id: accountId,
        tv_series_id: id,
        added_at: new Date(),
      });
      await newWatchlistTVSeries.save({ transaction });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return { success: true, code: 200, data: { msg: "Added to watchlist" } };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Delete watchlist services
const deleteWatchlistServices = async (id, type, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const isExistMovieInWatchlist = await WatchlistMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });
      if (!isExistMovieInWatchlist) {
        return {
          success: false,
          code: 404,
          data: { msg: "Movie not found in watchlist" },
        };
      }

      await WatchlistMovie.destroy({
        where: { account_id: accountId, movie_id: id },
        transaction,
      });
    } else if (type === "tv") {
      const isExistTVInWatchlist = await WatchlistTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });
      if (!isExistTVInWatchlist) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found in watchlist" },
        };
      }

      await WatchlistTVSeries.destroy({
        where: { account_id: accountId, tv_series_id: id },
        transaction,
      });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return {
      success: true,
      code: 200,
      data: { msg: "Removed from favorites" },
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Add favorite services
const addFavoriteServices = async (id, type, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const movie = await Movie.findOne({ where: { movie_id: id } });
      if (!movie) {
        return { success: false, code: 404, data: { msg: "Movie not found" } };
      }

      const isExistMovieInFavorite = await FavoriteMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });

      if (isExistMovieInFavorite) {
        return {
          success: false,
          code: 409,
          data: { msg: "Movie already in favorite" },
        };
      }

      const newFavoriteMovie = new FavoriteMovie({
        account_id: accountId,
        movie_id: id,
        added_at: new Date(),
      });
      await newFavoriteMovie.save({ transaction });
    } else if (type === "tv") {
      const tv = await tvSeries.findOne({ where: { tv_series_id: id } });
      if (!tv) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found" },
        };
      }
      const isExistTVInFavorite = await FavoriteTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });

      if (isExistTVInFavorite) {
        return {
          success: false,
          code: 409,
          data: { msg: "TV Series already in favorite" },
        };
      }

      const newFavoriteTVSeries = new FavoriteTVSeries({
        account_id: accountId,
        tv_series_id: id,
        added_at: new Date(),
      });
      await newFavoriteTVSeries.save({ transaction });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return { success: true, code: 200, data: { msg: "Added to favorites" } };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Delete favorite services
const deleteFavoriteServices = async (id, type, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const isExistMovieInFavorite = await FavoriteMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });
      if (!isExistMovieInFavorite) {
        return {
          success: false,
          code: 404,
          data: { msg: "Movie not found in favorites" },
        };
      }

      await FavoriteMovie.destroy({
        where: { account_id: accountId, movie_id: id },
        transaction,
      });
    } else if (type === "tv") {
      const isExistTVInFavorite = await FavoriteTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });
      if (!isExistTVInFavorite) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found in favorites" },
        };
      }

      await FavoriteTVSeries.destroy({
        where: { account_id: accountId, tv_series_id: id },
        transaction,
      });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return {
      success: true,
      code: 200,
      data: { msg: "Removed from favorites" },
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// add rating services
const addRatingServices = async (id, type, rating, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const movie = await Movie.findOne({ where: { movie_id: id } });
      if (!movie) {
        return { success: false, code: 404, data: { msg: "Movie not found" } };
      }

      const isExistMovieInRating = await RatingMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });

      if (isExistMovieInRating) {
        return {
          success: false,
          code: 409,
          data: { msg: "Movie already rated" },
        };
      }

      const newMovieRating = new RatingMovie({
        account_id: accountId,
        movie_id: id,
        rating,
        added_at: new Date(),
      });
      await newMovieRating.save({ transaction });
    } else if (type === "tv") {
      const tv = await tvSeries.findOne({ where: { tv_series_id: id } });
      if (!tv) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found" },
        };
      }
      const isExistTVInRating = await RatingTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });

      if (isExistTVInRating) {
        return {
          success: false,
          code: 409,
          data: { msg: "TV Series already rated" },
        };
      }

      const newTVSeriesRating = new RatingTVSeries({
        account_id: accountId,
        tv_series_id: id,
        rating,
        added_at: new Date(),
      });
      await newTVSeriesRating.save({ transaction });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return { success: true, code: 200, data: { msg: "Added to ratings" } };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Update rating services
const updateRatingServices = async (id, type, rating, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const movie = await Movie.findOne({ where: { movie_id: id } });
      if (!movie) {
        return { success: false, code: 404, data: { msg: "Movie not found" } };
      }

      const isExistMovieInRating = await RatingMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });

      if (!isExistMovieInRating) {
        return {
          success: false,
          code: 409,
          data: { msg: "Movie not rated" },
        };
      }

      isExistMovieInRating.rating = rating;
      await isExistMovieInRating.save({ transaction });
    } else if (type === "tv") {
      const tv = await tvSeries.findOne({ where: { tv_series_id: id } });
      if (!tv) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found" },
        };
      }
      const isExistTVInRating = await RatingTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });

      if (!isExistTVInRating) {
        return {
          success: false,
          code: 409,
          data: { msg: "TV Series not rated" },
        };
      }

      isExistTVInRating.rating = rating;
      await isExistTVInRating.save({ transaction });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return { success: true, code: 200, data: { msg: "Updated rating" } };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

const deleteRatingServices = async (id, type, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const movie = await Movie.findOne({ where: { movie_id: id } });
      if (!movie) {
        return { success: false, code: 404, data: { msg: "Movie not found" } };
      }

      const isExistMovieInRating = await RatingMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });

      if (!isExistMovieInRating) {
        return {
          success: false,
          code: 409,
          data: { msg: "Movie not rated" },
        };
      }

      await isExistMovieInRating.destroy({ transaction });
    } else if (type === "tv") {
      const tv = await tvSeries.findOne({ where: { tv_series_id: id } });
      if (!tv) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not found" },
        };
      }
      const isExistTVInRating = await RatingTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });

      if (!isExistTVInRating) {
        return {
          success: false,
          code: 409,
          data: { msg: "TV Series not rated" },
        };
      }

      await isExistTVInRating.destroy({ transaction });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return { success: true, code: 200, data: { msg: "Deleted rating" } };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Get rating by account id & media id & type
const getMediaInteractionStatusByAccountIdServices = async (
  accountId,
  id,
  type
) => {
  try {
    let rating;
    let favorite;
    let watchlist;

    if (type === "movie") {
      rating = await RatingMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });
      favorite = await FavoriteMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });
      watchlist = await WatchlistMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });
    } else if (type === "tv") {
      rating = await RatingTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });
      favorite = await FavoriteTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });
      watchlist = await WatchlistTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });
    } else {
      return {
        success: false,
        code: 400,
        data: { msg: "Invalid type" },
      };
    }

    // Handle to response api
    const data = {
      account_id: accountId,
      rating: rating ? rating.rating : 0,
      favorite: favorite ? true : false,
      watchlist: watchlist ? true : false,
      rated_at: rating ? rating.rated_at : null,
    };

    if (type === "movie") {
      data.movie_id = Number(id);
    } else if (type === "tv") {
      data.tv_series_id = Number(id);
    }

    return {
      success: true,
      code: 200,
      data,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTrendingMediasServices,
  getAllMovieMultiMediaSerices,
  getAllTVSeriesMultiMediaServices,
  getVideoTrailersServices,
  addWatchlistServices,
  addFavoriteServices,
  addRatingServices,
  updateRatingServices,
  deleteRatingServices,
  getMediaInteractionStatusByAccountIdServices,
  deleteFavoriteServices,
  deleteWatchlistServices,
};
