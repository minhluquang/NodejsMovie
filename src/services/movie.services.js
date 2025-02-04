const { Op, where } = require("sequelize");
const { Movie } = require("../models");

const getTrendingMoviesServices = async (type) => {
  try {
    let trendingMovies = [];

    if (type === "today") {
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

      trendingMovies = trendingMovies.concat(thisWeekMovies);

      if (trendingMovies.length < 20) {
        const lastMonthMovies = await Movie.findAll({
          where: {
            release_date: {
              [Op.gte]: new Date(
                new Date().setMonth(new Date().getMonth() - 1) // >= a month ago
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

        trendingMovies = trendingMovies.concat(lastMonthMovies);
      }

      if (trendingMovies.length < 20) {
        const lastYearMovies = await Movie.findAll({
          where: {
            release_date: {
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

        trendingMovies = trendingMovies.concat(lastYearMovies);
      }
    } else {
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
    }

    // Return if have no movie
    if (!trendingMovies || trendingMovies.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No movies found" },
      };
    }

    // Return if have movie
    return { success: true, code: 200, data: trendingMovies };
  } catch (error) {
    throw error;
  }
};

// Get upcoming movies
const getUpcomingMoviesServices = async () => {
  try {
    const upcomingMovie = await Movie.findAll({
      where: {
        release_date: {
          [Op.gte]: new Date(), // >= today
          [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 20)), // <= 20 days in future
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

    // Return if have no movie
    if (!upcomingMovie || upcomingMovie.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No upcoming movies found within the next 20 days." },
      };
    }

    // Return if have movie
    return { success: true, code: 200, data: upcomingMovie };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTrendingMoviesServices,
  getUpcomingMoviesServices,
};
