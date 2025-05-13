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
      case "account_rating":
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      case "created_at":
        return sortOrder === "asc"
          ? new Date(a.rated_at) - new Date(b.rated_at)
          : new Date(b.rated_at) - new Date(a.rated_at);
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

const getRatingMediaByAccountIdServices = async (
  account_id,
  sort_by,
  sort_order
) => {
  try {
    let ratingMovie = await RatingMovie.findAll({
      where: { account_id },
      order: [["rated_at", "ASC"]],
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
          include: [{ model: FavoriteMovie }],
        },
      ],
    });

    let ratingTVSeries = await RatingTVSeries.findAll({
      where: { account_id },
      order: [["rated_at", "ASC"]],
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
          include: [{ model: FavoriteTVSeries }],
        },
      ],
    });

    ratingMovie = ratingMovie.map((item) => {
      item = item.toJSON();
      item.title = item.Movie.title;
      item.original_title = item.Movie.original_title;
      item.release_date = item.Movie.release_date;
      item.vote_average = item.Movie.vote_average;
      item.overview = item.Movie.overview;
      item.poster_path = item.Movie.poster_path;
      item.popularity = item.Movie.popularity;
      item.favorite = item.Movie.FavoriteMovies?.[0].movie_id ? 1 : 0;
      delete item.Movie;
      return item;
    });

    ratingTVSeries = ratingTVSeries.map((item) => {
      item = item.toJSON();
      item.name = item.tvSery.name;
      item.original_name = item.tvSery.original_name;
      item.first_air_date = item.tvSery.first_air_date;
      item.vote_average = item.tvSery.vote_average;
      item.overview = item.tvSery.overview;
      item.poster_path = item.tvSery.poster_path;
      item.popularity = item.tvSery.popularity;
      item.favorite = item.tvSery.FavoriteTVSeries?.[0]?.tv_series_id ? 1 : 0;
      delete item.tvSery;
      return item;
    });

    if (sort_by && sort_order) {
      ratingMovie = sortData([...ratingMovie], sort_by, sort_order);
      ratingTVSeries = sortData([...ratingTVSeries], sort_by, sort_order);
    } else if (sort_by) {
      if (sort_order) {
        ratingMovie = sortData([...ratingMovie], sort_by, sort_order);
        ratingTVSeries = sortData([...ratingTVSeries], sort_by, sort_order);
      } else {
        ratingMovie = sortData([...ratingMovie], sort_by, "asc");
        ratingTVSeries = sortData([...ratingTVSeries], sort_by, "asc");
      }
    }

    return {
      success: true,
      code: 200,
      data: {
        rating_movie_list: ratingMovie,
        rating_tv_series_list: ratingTVSeries,
      },
    };
  } catch (error) {
    throw new Error(
      "Error fetching rating media by account ID: " + error.message
    );
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

      await RatingMovie.create(
        {
          account_id: accountId,
          movie_id: id,
          rating,
          added_at: new Date(),
        },
        { transaction }
      );
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

      await RatingTVSeries.create(
        {
          account_id: accountId,
          tv_series_id: id,
          rating,
          added_at: new Date(),
        },
        { transaction }
      );
    } else {
      return { success: false, code: 400, data: { msg: "Invalid type" } };
    }
    await transaction.commit();
    return { success: true, code: 200, data: { msg: "Added to ratings" } };
  } catch (error) {
    console.error("Validation Error Details:", error.errors);
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
          code: 404,
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
          code: 404,
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
          code: 404,
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

module.exports = {
  getRatingMediaByAccountIdServices,
  addRatingServices,
  updateRatingServices,
  deleteRatingServices,
};
