const {
  List,
  MediaList,
  Movie,
  tvSeries,
  RatingMovie,
  RatingTVSeries,
  FavoriteMovie,
  ListMovie,
  FavoriteTVSeries,
  ListTVSeries,
  Account,
  AccountDetail,
  WatchlistMovie,
  WatchlistTVSeries,
  sequelize,
} = require("../models");

// get watchlist media by account id
const sortData = (data, sortBy, sortOrder) => {
  if (sortBy === "upcoming") {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);

    const filterData = data.filter((item) => {
      const releaseDate = new Date(item.release_date || item.first_air_date);
      return releaseDate >= now && releaseDate <= in30Days;
    });

    return filterData.sort((a, b) => {
      if (sortOrder === "asc") {
        return (
          new Date(a.release_date || a.first_air_date) -
          new Date(b.release_date || b.first_air_date)
        );
      } else {
        return (
          new Date(b.release_date || b.first_air_date) -
          new Date(a.release_date || a.first_air_date)
        );
      }
    });
  }

  return [...data].sort((a, b) => {
    switch (sortBy) {
      case "created_at":
        return sortOrder === "asc"
          ? new Date(a.added_at) - new Date(b.added_at)
          : new Date(b.added_at) - new Date(a.added_at);
      case "popularity":
        return sortOrder === "asc"
          ? a.popularity - b.popularity
          : b.popularity - a.popularity;
      case "release_date":
        return sortOrder === "asc"
          ? new Date(a.release_date) - new Date(b.release_date)
          : new Date(b.release_date) - new Date(a.release_date);
      default:
        return 0;
    }
  });
};

const getWatchlistMediaByAccountIdServices = async (
  account_id,
  sort_by,
  sort_order
) => {
  try {
    let watchlistMovie = await WatchlistMovie.findAll({
      where: { account_id },
      order: [["added_at", "ASC"]],
      include: [
        {
          model: Movie,
          attributes: [
            "title",
            "original_title",
            "release_date",
            "vote_average",
            "overview",
            "poster_path",
            "popularity",
          ],
          include: [
            { model: FavoriteMovie },
            { model: RatingMovie, attributes: ["rating"] },
          ],
        },
      ],
    });

    let watchlistTVSeries = await WatchlistTVSeries.findAll({
      where: { account_id },
      order: [["added_at", "ASC"]],
      include: [
        {
          model: tvSeries,
          attributes: [
            "name",
            "original_name",
            "first_air_date",
            "vote_average",
            "overview",
            "poster_path",
            "popularity",
          ],
          include: [
            { model: FavoriteTVSeries },
            { model: RatingTVSeries, attributes: ["rating"] },
          ],
        },
      ],
    });

    watchlistMovie = watchlistMovie.map((item) => {
      item = item.toJSON();
      item.title = item.Movie.title;
      item.original_title = item.Movie.original_title;
      item.release_date = item.Movie.release_date;
      item.vote_average = item.Movie.vote_average;
      item.overview = item.Movie.overview;
      item.poster_path = item.Movie.poster_path;
      item.popularity = item.Movie.popularity;
      item.favorite = item.Movie.FavoriteMovies?.[0]?.movie_id ? 1 : 0;
      item.rating = item.Movie.RatingMovies?.[0]?.rating || 0;
      delete item.Movie;
      return item;
    });

    watchlistTVSeries = watchlistTVSeries.map((item) => {
      item = item.toJSON();
      item.name = item.tvSery.name;
      item.original_name = item.tvSery.original_name;
      item.first_air_date = item.tvSery.first_air_date;
      item.vote_average = item.tvSery.vote_average;
      item.overview = item.tvSery.overview;
      item.poster_path = item.tvSery.poster_path;
      item.popularity = item.tvSery.popularity;
      item.favorite = item.tvSery.FavoriteTVSeries?.[0]?.tv_series_id ? 1 : 0;
      item.rating = item.tvSery.RatingTVSeries?.[0]?.rating || 0;
      delete item.tvSery;
      return item;
    });

    if (sort_by && sort_order) {
      watchlistMovie = sortData([...watchlistMovie], sort_by, sort_order);
      watchlistTVSeries = sortData([...watchlistTVSeries], sort_by, sort_order);
    } else if (sort_by) {
      if (sort_order) {
        watchlistMovie = sortData([...watchlistMovie], sort_by, sort_order);
        watchlistTVSeries = sortData(
          [...watchlistTVSeries],
          sort_by,
          sort_order
        );
      } else {
        watchlistMovie = sortData([...watchlistMovie], sort_by, "asc");
        watchlistTVSeries = sortData([...watchlistTVSeries], sort_by, "asc");
      }
    }

    return {
      success: true,
      code: 200,
      data: {
        watchlist_movie_list: watchlistMovie,
        watchlist_tv_series_list: watchlistTVSeries,
        sort_by,
        sort_order,
      },
    };
  } catch (error) {
    throw new Error(
      "Error fetching watchlist media by account ID: " + error.message
    );
  }
};

const deleteWatchlistServices = async (id, type, accountId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (type === "movie") {
      const movie = await Movie.findOne({ where: { movie_id: id } });
      if (!movie) {
        return { success: false, code: 404, data: { msg: "Movie not found" } };
      }

      const isExistMovieInRating = await WatchlistMovie.findOne({
        where: { account_id: accountId, movie_id: id },
      });

      if (!isExistMovieInRating) {
        return {
          success: false,
          code: 404,
          data: { msg: "Movie not added in your watchlist" },
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
      const isExistTVInRating = await WatchlistTVSeries.findOne({
        where: { account_id: accountId, tv_series_id: id },
      });

      if (!isExistTVInRating) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV Series not added in your watchlist" },
        };
      }

      await isExistTVInRating.destroy({ transaction });
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return {
      success: true,
      code: 200,
      data: { msg: "Deleted media in your watchlist." },
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
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

module.exports = {
  getWatchlistMediaByAccountIdServices,
  deleteWatchlistServices,
  addWatchlistServices,
};
