const { Op } = require("sequelize");
const {
  tvSeries,
  tvSeason,
  tvSeasonPeople,
  tvEpisode,
  tvEpisodePeople,
  People,
} = require("../models");
const _ = require("lodash");

const getLastAirEpisode = async (tv_series_id) => {
  try {
    const lastAirEpisode = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.lte]: new Date() } },
      include: {
        model: tvEpisode,
        as: "episodes",
        where: { air_date: { [Op.lte]: new Date() } },
      },
      order: [
        ["air_date", "desc"],
        [{ model: tvEpisode, as: "episodes" }, "episode_number", "desc"],
      ],
      limit: 1,
    });

    return lastAirEpisode?.episodes[0] || null;
  } catch (error) {
    throw error;
  }
};

const getNextAirEpisode = async (tv_series_id) => {
  try {
    const nextAirEpisode = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.gte]: new Date() } },
      include: {
        model: tvEpisode,
        as: "episodes",
        where: { air_date: { [Op.gte]: new Date() } },
      },
      order: [
        ["air_date", "asc"],
        [{ model: tvEpisode, as: "episodes" }, "episode_number", "desc"],
      ],
      limit: 1,
    });

    return nextAirEpisode?.episodes[0] || null;
  } catch (error) {
    throw error;
  }
};

const getNextAirSeason = async (tv_series_id) => {
  try {
    const nextAirSeason = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.gte]: new Date() } },
      include: {
        model: tvEpisode,
        as: "episodes",
        where: { air_date: { [Op.gte]: new Date() } },
      },
      order: [["air_date", "asc"]],
      limit: 1,
    });

    return nextAirSeason || null;
  } catch (error) {
    throw error;
  }
};

const getLastAirSeason = async (tv_series_id) => {
  try {
    const lastAirSeason = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.lte]: new Date() } },
      include: {
        model: tvEpisode,
        as: "episodes",
        where: { air_date: { [Op.lte]: new Date() } },
      },
      order: [
        [{ model: tvEpisode, as: "episodes" }, "air_date", "desc"],
        [{ model: tvEpisode, as: "episodes" }, "episode_number", "desc"],
        ["air_date", "desc"],
      ],
      limit: 1,
    });

    return lastAirSeason || null;
  } catch (error) {
    throw error;
  }
};

const getDetailSeasonServices = async (tv_series_id, season_number) => {
  try {
    let tvSeasonDetail = await tvSeason.findOne({
      where: { tv_series_id, season_number },
      include: {
        model: tvEpisode,
        as: "episodes",
        attributes: {
          exclude: ["createdAt", "updatedAt", "tv_episode_id", "tv_season_id"],
        },
        include: {
          model: tvEpisodePeople,
          include: {
            model: People,
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "biography",
                "adult",
                "homepage",
                "place_of_birth",
                "deathday",
                "birthday",
              ],
            },
          },
          attributes: {
            exclude: ["created_at", "updated_at", "tv_episode_id"],
          },
        },
      },
    });

    if (!tvSeasonDetail) {
      return {
        success: true,
        code: 200,
        data: { msg: "No tv season found." },
      };
    }

    tvSeasonDetail = tvSeasonDetail.get({ plain: true });

    // Transform episodes
    if (tvSeasonDetail.episodes && Array.isArray(tvSeasonDetail.episodes)) {
      tvSeasonDetail.episodes.forEach((episode) => {
        if (episode.tvEpisodePeople && Array.isArray(episode.tvEpisodePeople)) {
          const flattenedPeople = episode.tvEpisodePeople.map((personItem) => {
            if (personItem.Person) {
              const { Person, ...rest } = personItem;
              return { ...Person, character: personItem.character_role };
            }
            return personItem;
          });

          const crew = [];
          const guest_stars = [];

          flattenedPeople.forEach((person) => {
            if (
              person.known_for_department === "Directing" ||
              person.known_for_department === "Writing"
            ) {
              crew.push(person);
            } else {
              guest_stars.push(person);
            }
          });

          crew.sort((a, b) => b.popularity - a.popularity);
          guest_stars.sort((a, b) => b.popularity - a.popularity);

          episode.crew = crew;
          episode.guest_stars = guest_stars;

          delete episode.tvEpisodePeople;
        }
      });
    }

    // Handle to create crew & guest_starts array

    return {
      success: true,
      code: 200,
      data: tvSeasonDetail,
    };
  } catch (error) {
    throw error;
  }
};

// Get credits of tv_seasons
const getTVSeasonCreditsServices = async (tv_series_id, season_number) => {
  try {
    let tvSeasonCredits = await tvSeries.findAll({
      where: { tv_series_id },
      attributes: [],
      include: {
        model: tvSeason,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { season_number },
        include: {
          model: tvSeasonPeople,
          as: "credits",
          attributes: { exclude: ["created_at", "updated_at"] },
          include: {
            model: People,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      },
    });

    if (!tvSeasonCredits || tvSeasonCredits.length === 0) {
      return {
        success: true,
        code: 200,
        data: {
          cast: [],
          crew: [],
        },
      };
    }

    tvSeasonCredits = tvSeasonCredits.map((series) =>
      series.get({ plain: true })
    );

    const series = tvSeasonCredits[0];
    const season = series?.tvSeasons?.[0];
    const creditData = season?.credits;

    crew =
      creditData
        ?.filter((person) => person.character_role === null)
        .map((person) => ({
          job: person.job,
          department: person.department,
          name: person.Person.name,
          person_id: person.person_id,
          popularity: person.Person.popularity,
          known_for_department: person.Person.known_for_department,
        })) || [];

    cast =
      creditData
        ?.filter((person) => person.character_role !== null)
        .map((person) => ({
          character: person.character_role,
          name: person.Person.name,
          person_id: person.person_id,
          popularity: person.Person.popularity,
          known_for_department: person.Person.known_for_department,
        })) || [];

    cast = _.orderBy(cast, ["popularity"], ["desc"]);
    crew = _.orderBy(crew, ["popularity"], ["desc"]);

    return {
      success: true,
      code: 200,
      data: {
        cast,
        crew,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getLastAirEpisode,
  getNextAirEpisode,
  getNextAirSeason,
  getLastAirSeason,
  getDetailSeasonServices,
  getTVSeasonCreditsServices,
};
