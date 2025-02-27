const { Op } = require("sequelize");
const {
  tvSeries,
  tvSeason,
  tvEpisode,
  tvEpisodePeople,
  People,
  tvSeasonPeople,
} = require("../models");
const _ = require("lodash");

const getDetailEpisodeServices = async (
  tv_series_id,
  season_number,
  episode_number
) => {
  try {
    const episode = await tvSeries.findOne({
      where: { tv_series_id },
      include: [
        {
          model: tvSeason,
          where: { season_number },
          include: [
            {
              model: tvEpisode,
              as: "episodes",
              attributes: {
                exclude: ["createdAt", "updatedAt", "tv_season_id"],
              },
              where: { episode_number },
            },
          ],
        },
      ],
    });

    if (!episode?.tvSeasons?.[0]?.episodes?.length) {
      return {
        success: true,
        code: 200,
        data: { msg: "No tv episode found." },
      };
    }

    const episodeData = episode.tvSeasons[0].episodes[0].get({ plain: true });

    return {
      success: true,
      code: 200,
      data: {
        ...episodeData,
        season_number: episode.tvSeasons[0].season_number,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Get credits of tv_episode
const getTVEpisodeCreditsServices = async (
  tv_series_id,
  season_number,
  episode
) => {
  try {
    let tvEpisodeCredits = await tvSeries.findAll({
      where: { tv_series_id },
      attributes: [],
      include: {
        model: tvSeason,
        where: { season_number },
        include: [
          {
            model: tvEpisode,
            as: "episodes",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: { episode_number: episode },
            include: {
              model: tvEpisodePeople,
              separate: true,
              attributes: { exclude: ["created_at", "updated_at"] },
              include: {
                model: People,
                attributes: { exclude: ["created_at", "updated_at"] },
              },
            },
          },
          {
            model: tvSeasonPeople,
            as: "credits",
            attributes: { exclude: ["created_at", "updated_at"] },
            include: {
              model: People,
              attributes: { exclude: ["created_at", "updated_at"] },
            },
          },
        ],
      },
    });

    if (!tvEpisodeCredits || tvEpisodeCredits.length === 0) {
      return {
        success: true,
        code: 200,
        data: {
          cast: [],
          crew: [],
          guest_stars: [],
        },
      };
    }

    tvEpisodeCredits = tvEpisodeCredits.map((series) =>
      series.get({ plain: true })
    );

    const series = tvEpisodeCredits[0];
    const season = series?.tvSeasons?.[0];
    const episodeData = season?.episodes?.[0];
    const castData = season?.credits;

    guest_stars =
      episodeData?.tvEpisodePeople
        ?.filter((person) => person.character_role !== null)
        .map((person) => ({
          character: person.character_role,
          name: person.Person.name,
          person_id: person.person_id,
          popularity: person.Person.popularity,
          known_for_department: person.Person.known_for_department,
        })) || [];

    crew =
      episodeData?.tvEpisodePeople
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
      castData.map((person) => ({
        character: person.character_role,
        name: person.Person.name,
        person_id: person.person_id,
        popularity: person.Person.popularity,
        known_for_department: person.Person.known_for_department,
      })) || [];

    guest_stars = _.orderBy(guest_stars, ["popularity"], ["desc"]);
    cast = _.orderBy(cast, ["popularity"], ["desc"]);
    crew = _.orderBy(crew, ["popularity"], ["desc"]);

    return {
      success: true,
      code: 200,
      data: {
        guest_stars,
        cast,
        crew,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getDetailEpisodeServices, getTVEpisodeCreditsServices };
