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
  MovieProductionCompany,
  ProductionCompany,
  MovieImage,
  MovieVideo,
} = require("../models");
const _ = require("lodash");

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
        success: true,
        code: 200,
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
        success: true,
        code: 200,
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
          order: [[{ model: Review }, "createdAt", "DESC"]],
        },
        {
          model: MovieProductionCompany,
          as: "production_companies",
          include: {
            model: ProductionCompany,
          },
        },
      ],
    });

    if (!detailMovie || detailMovie.length === 0) {
      return {
        success: true,
        code: 200,
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

    // remove attributes not use in production_companies
    result.production_companies = result.production_companies.map((k) => ({
      production_company_id: k.ProductionCompany.production_company_id,
      name: k.ProductionCompany.name,
      original_country: k.ProductionCompany.original_country,
      logo_path: k.ProductionCompany.logo_path,
    }));

    // remove/add attributes (not) use in reviews
    const reviewCount = await MovieReview.count({
      where: { movie_id },
    });

    result.reviews = result.reviews.map((k) => ({
      total_reviews: reviewCount,
      review_id: k.review_id,
      content: k.Review.content,
      rating: k.Review.rating,
      author: {
        account_id: k.Review.Account.account_id,
        username: k.Review.Account.username || null,
        name: k.Review.Account.name || null,
        profile_picture: k.Review.Account.profile_picture || null,
      },
      created_at: k.Review.createdAt,
    }));

    // Return if have movie
    return { success: true, code: 200, data: result };
  } catch (error) {
    throw error;
  }
};

// get images of movie by movie_id
const getAllMovieImagesServices = async (movie_id) => {
  try {
    const movieImages = await MovieImage.findAll({
      where: { movie_id },
    });

    if (!movieImages || movieImages.length === 0) {
      return {
        success: true,
        code: 200,
        data: { msg: "No image found." },
      };
    }

    const groupedImages = movieImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) {
        acc[type] = [];
      }

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

    // remove attributes not use in groupedImages

    // Return if have movie
    return { success: true, code: 200, data: groupedImages };
  } catch (error) {
    throw error;
  }
};

// get videos of movie by movie_id
const getAllMovieVideosServices = async (movie_id) => {
  try {
    let movieVideos = await MovieVideo.findAll({
      where: { movie_id },
    });

    if (!movieVideos || movieVideos.length === 0) {
      return {
        success: true,
        code: 200,
        data: { msg: "No video found." },
      };
    }

    // remove attributes not use in movieVideos
    movieVideos = movieVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    return { success: true, code: 200, data: movieVideos };
  } catch (error) {
    throw error;
  }
};

// get credits
const getAllMovieCreditsServices = async (movie_id) => {
  try {
    // First, get your data from the database as you currently are
    let movieCredits = await Movie.findAll({
      where: { movie_id },
      attributes: [],
      include: {
        model: MoviePeople,
        as: "credits",
        attributes: [["character_role", "character"], "department", "job"],
        include: {
          model: People,
          attributes: [
            "name",
            "person_id",
            "popularity",
            "known_for_department",
          ],
        },
      },
    });

    if (!movieCredits || movieCredits.length === 0) {
      return {
        success: true,
        code: 200,
        data: { msg: "No credit found." },
      };
    }

    let cast = [];
    let crew = [];

    // Process all credits from all movies
    movieCredits.forEach((movie) => {
      movie = movie.get({ plain: true });

      movie.credits.forEach((credit) => {
        // Add to appropriate array based on known_for_department
        if (credit.character) {
          let person = {
            character: credit.character,
            name: credit.Person.name,
            person_id: credit.Person.person_id,
            popularity: credit.Person.popularity,
            known_for_department: credit.Person.known_for_department,
          };
          cast.push(person);
        } else {
          let person = {
            name: credit.Person.name,
            person_id: credit.Person.person_id,
            popularity: credit.Person.popularity,
            known_for_department: credit.Person.known_for_department,
            department: credit.department,
            job: credit.job,
          };
          crew.push(person);
        }
      });
    });

    cast = _.orderBy(
      _.uniqWith(
        cast,
        (a, b) => a.person_id === b.person_id && a.character === b.character
      ),
      ["popularity"],
      ["desc"]
    );

    crew = _.orderBy(
      _.uniqWith(
        crew,
        (a, b) => a.person_id === b.person_id && a.job === b.job
      ),
      ["popularity"],
      ["desc"]
    );

    return {
      success: true,
      code: 200,
      data: { cast, crew },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTrendingMoviesServices,
  getUpcomingMoviesServices,
  getDetailMovieServices,
  getAllMovieImagesServices,
  getAllMovieVideosServices,
  getAllMovieCreditsServices,
};
