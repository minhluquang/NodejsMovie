const { Op } = require("sequelize");
const {
  Movie,
  MovieKeyword,
  Keyword,
  MovieGenre,
  Genre,
  MovieCertification,
  Certification,
  SocialNetworkDetail,
  SocialNetwork,
  MoviePeople,
  People,
  MovieReview,
  Review,
  Account,
  AccountDetail,
} = require("../models");

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

// Get detail movie
const getDetailMovieServices = async (movie_id) => {
  try {
    const detailMovie = await Movie.findOne({
      where: { movie_id },
      include: [
        {
          model: MovieKeyword,
          as: "keywords",
          include: {
            model: Keyword,
          },
        },
        {
          model: MovieGenre,
          as: "genres",
          include: {
            model: Genre,
          },
        },
        {
          model: MovieCertification,
          as: "certifications",
          include: {
            model: Certification,
          },
        },
        {
          model: SocialNetworkDetail,
          as: "social_networks",
          include: {
            model: SocialNetwork,
          },
        },
        {
          model: MoviePeople,
          as: "credits",
          include: { model: People },
          limit: 9,
          order: [[{ model: People }, "popularity", "desc"]],
        },
        {
          model: MovieReview,
          as: "reviews",
          include: {
            model: Review,
            include: {
              model: Account,
              include: { model: AccountDetail, as: "account_detail" },
            },
          },
          limit: 1,
          order: [["added_at", "desc"]],
        },
      ],
    });

    if (!detailMovie || detailMovie.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No movie found" },
      };
    }

    // remove attributes not use in keywords
    const result = detailMovie.toJSON();
    result.keywords = result.keywords.map((k) => ({
      keyword_id: k.Keyword.keyword_id,
      name: k.Keyword.name,
    }));

    // remove attributes not use in genres
    result.genres = result.genres.map((k) => ({
      genre_id: k.Genre.genre_id,
      name: k.Genre.name,
    }));

    // remove attributes not use in certification
    result.certifications = result.certifications.map((k) => ({
      certification_id: k.Certification.certification_id,
      certification: k.Certification.certification,
    }));

    // remove attributes not use in social network
    result.social_networks = result.social_networks.map((k) => ({
      social_network_id: k.social_network_id,
      platform: k.SocialNetwork.platform,
      social_network_username: k.social_network_username,
    }));

    // remove attributes not use in credits
    result.credits = result.credits.map((k) => ({
      person_id: k.person_id,
      character_role: k.character_role,
      profile_path: k.Person.profile_path,
      name: k.Person.name,
    }));

    // Return if have movie
    return { success: true, code: 200, data: result };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTrendingMoviesServices,
  getUpcomingMoviesServices,
  getDetailMovieServices,
};
