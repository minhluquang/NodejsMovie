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
  sequelize,
} = require("../models");

// get rating media by account id
const sortData = (data, sortBy, sortOrder) => {
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

const getFavoriteMediaByAccountIdServices = async (
  account_id,
  sort_by,
  sort_order
) => {
  try {
    let favoriteMovie = await FavoriteMovie.findAll({
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
          include: [{ model: RatingMovie, attributes: ["rating"] }],
        },
      ],
    });

    let favoriteTVSeries = await FavoriteTVSeries.findAll({
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
          include: [{ model: RatingTVSeries, attributes: ["rating"] }],
        },
      ],
    });

    favoriteMovie = favoriteMovie.map((item) => {
      item = item.toJSON();
      item.title = item.Movie.title;
      item.original_title = item.Movie.original_title;
      item.release_date = item.Movie.release_date;
      item.vote_average = item.Movie.vote_average;
      item.overview = item.Movie.overview;
      item.poster_path = item.Movie.poster_path;
      item.popularity = item.Movie.popularity;
      item.rating = item.Movie.RatingMovies?.[0]?.rating || 0;
      item.favorite = 1;
      delete item.Movie;
      return item;
    });

    favoriteTVSeries = favoriteTVSeries.map((item) => {
      item = item.toJSON();
      item.name = item.tvSery.name;
      item.original_name = item.tvSery.original_name;
      item.first_air_date = item.tvSery.first_air_date;
      item.vote_average = item.tvSery.vote_average;
      item.overview = item.tvSery.overview;
      item.poster_path = item.tvSery.poster_path;
      item.popularity = item.tvSery.popularity;
      item.rating = item.tvSery.RatingTVSeries?.[0]?.rating || 0;
      item.favorite = 1;
      delete item.tvSery;
      return item;
    });

    if (sort_by && sort_order) {
      favoriteMovie = sortData([...favoriteMovie], sort_by, sort_order);
      favoriteTVSeries = sortData([...favoriteTVSeries], sort_by, sort_order);
    } else if (sort_by) {
      if (sort_order) {
        favoriteMovie = sortData([...favoriteMovie], sort_by, sort_order);
        favoriteTVSeries = sortData([...favoriteTVSeries], sort_by, sort_order);
      } else {
        favoriteMovie = sortData([...favoriteMovie], sort_by, "asc");
        favoriteTVSeries = sortData([...favoriteTVSeries], sort_by, "asc");
      }
    }

    return {
      success: true,
      code: 200,
      data: {
        favorite_movie_list: favoriteMovie,
        favorite_tv_series_list: favoriteTVSeries,
      },
    };
  } catch (error) {
    throw new Error(
      "Error fetching favorite media by account ID: " + error.message
    );
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

module.exports = {
  getFavoriteMediaByAccountIdServices,
  addFavoriteServices,
  deleteFavoriteServices,
};
