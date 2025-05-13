const {
  List,
  MediaList,
  Movie,
  tvSeries,
  RatingMovie,
  RatingTVSeries,
  Account,
  AccountDetail,
  sequelize,
} = require("../models");

const getListByAccountIdServices = async (account_id) => {
  try {
    const lists = await List.findAll({
      where: { account_id },
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: MediaList,
          as: "media_lists",
        },
      ],
    });

    return { success: true, code: 200, data: lists };
  } catch (error) {
    throw new Error("Error fetching lists by account ID: " + error.message);
  }
};

const createNewListServices = async (
  account_id,
  name,
  description,
  is_public,
  is_comment,
  sort_by
) => {
  let transaction;
  try {
    const transaction = await sequelize.transaction();

    const newList = await List.create(
      {
        account_id,
        name,
        description,
        is_public,
        is_comment,
        sort_by,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    newList.is_public = is_public ? 1 : 0;
    newList.is_comment = is_comment ? 1 : 0;

    await transaction.commit();

    return { success: true, code: 201, data: newList };
  } catch (error) {
    await transaction.rollback();
    throw new Error("Error creating new list: " + error.message);
  }
};

const updateNewListServices = async (
  id,
  account_id,
  name,
  description,
  is_public,
  is_comment,
  sort_by,
  backdrop_path
) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const updatedList = await List.update(
      {
        name,
        description,
        is_public,
        is_comment,
        sort_by,
        backdrop_path,
        updated_at: new Date(),
      },
      { where: { list_id: id, account_id } },
      { transaction }
    );

    if (updatedList[0] === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "List not found or not updated" },
      };
    }

    const data = await List.findOne({
      where: { list_id: id, account_id },
      transaction,
    });
    await transaction.commit();
    return { success: true, code: 200, data };
  } catch (error) {
    await transaction.rollback();
    throw new Error("Error updating list: " + error.message);
  }
};

// Get list by account_id and list_id
const sortMediaLists = (mediaLists, sort_by = "originalAcs") => {
  switch (sort_by) {
    case "originalAcs":
      return mediaLists.sort(
        (a, b) => new Date(a.added_at) - new Date(b.added_at)
      );
    case "originalDes":
      return mediaLists.sort(
        (a, b) => new Date(b.added_at) - new Date(a.added_at)
      );
    case "ratingAcs":
      return mediaLists.sort((a, b) => a.rating - b.rating);
    case "ratingDes":
      return mediaLists.sort((a, b) => b.rating - a.rating);
    case "releaseDateAsc":
      return mediaLists.sort(
        (a, b) => new Date(a.release_date) - new Date(b.release_date)
      );
    case "releaseDateDes":
      return mediaLists.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    case "titleAsc":
      return mediaLists.sort((a, b) =>
        (a.title || a.name).localeCompare(b.title || b.name)
      );
    case "titleDes":
      return mediaLists.sort((a, b) =>
        (b.title || b.name).localeCompare(a.title || a.name)
      );

    default:
      return mediaLists;
  }
};

const getListByAccountIdAndListIdServices = async (
  account_id,
  list_id,
  sort_by,
  show_me
) => {
  try {
    const rawList = await List.findOne({
      where: { list_id },
      include: [
        {
          model: MediaList,
          as: "media_lists",
          include: [
            {
              model: Movie,
              attributes: [
                "original_title",
                "title",
                "backdrop_path",
                "release_date",
                "movie_id",
                "vote_average",
                "runtime",
                "revenue",
                "poster_path",
              ],
              include: [
                {
                  model: RatingMovie,
                  attributes: ["rating"],
                },
              ],
            },
            {
              model: tvSeries,
              attributes: [
                "name",
                "original_name",
                "backdrop_path",
                "first_air_date",
                "tv_series_id",
                "vote_average",
                "poster_path",
              ],
              include: [
                {
                  model: RatingTVSeries,
                  attributes: ["rating"],
                },
              ],
            },
          ],
        },
        {
          model: Account,
          include: [
            {
              model: AccountDetail,
              as: "account_detail",
              attributes: ["profile_picture"],
            },
          ],
        },
      ],
    });

    if (!rawList) {
      return { success: false, code: 404, data: { msg: "List not found" } };
    }

    const list = rawList.toJSON();

    if (list.is_public === 0 && account_id !== list.account_id) {
      return {
        success: false,
        code: 403,
        data: { msg: "This list is private" },
      };
    }

    list.username = list.Account?.username;
    list.profile_picture = list.Account?.account_detail?.profile_picture;
    list.Account = undefined;

    let rating_average = 0;
    let totalRuntime = 0;
    let totalRevenue = 0;

    list.media_lists = list.media_lists.map((media) => {
      if (media.type === "movie") {
        rating_average += media.Movie?.vote_average || 0;
        totalRuntime += media.Movie?.runtime || 0;
        totalRevenue += media.Movie?.revenue || 0;
        return {
          ...media,
          title: media.Movie?.title,
          original_title: media.Movie?.original_title,
          backdrop_path: media.Movie?.backdrop_path,
          release_date: media.Movie?.release_date,
          rating: media.Movie?.RatingMovies?.[0]?.rating || 0,
          vote_average: media.Movie?.vote_average,
          runtime: media.Movie?.runtime,
          revenue: media.Movie?.revenue,
          poster_path: media.Movie?.poster_path,
          RatingMovie: undefined,
          Movie: undefined,
          tvSery: undefined,
        };
      } else if (media.type === "tv") {
        rating_average += media.tvSery?.vote_average || 0;
        return {
          ...media,
          name: media.tvSery?.name,
          original_name: media.tvSery?.original_name,
          backdrop_path: media.tvSery?.backdrop_path,
          release_date: media.tvSery?.first_air_date,
          rating: media.tvSery?.RatingTVSeries?.[0]?.rating || 0,
          vote_average: media.tvSery?.vote_average,
          poster_path: media.tvSery?.poster_path,
          RatingTVSeries: undefined,
          Movie: undefined,
          tvSery: undefined,
        };
      }
    });

    if (sort_by) {
      list.media_lists = sortMediaLists(list.media_lists, sort_by);
    } else {
      list.media_lists = sortMediaLists(list.media_lists, list.sort_by);
    }

    list.rating_average = rating_average / list.media_lists.length;
    list.total_runtime = totalRuntime;
    list.total_revenue = totalRevenue;
    list.items_count = list.media_lists.length;

    if (show_me === "seen") {
      list.media_lists = list.media_lists.filter((media) => media.rating > 0);
    } else if (show_me === "unseen") {
      list.media_lists = list.media_lists.filter((media) => media.rating === 0);
    }

    return {
      success: true,
      code: 200,
      data: list,
    };
  } catch (error) {
    throw new Error(
      "Error fetching list by account ID and list ID: " + error.message
    );
  }
};

// Delete list
const deleteListByAccountIdAndListIdServices = async (account_id, list_id) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const list = await List.findOne({
      where: { list_id, account_id },
    });

    if (!list) {
      return { success: false, code: 404, data: { msg: "List not found" } };
    }

    await MediaList.destroy({
      where: { list_id },
      transaction,
    });
    await list.destroy({ transaction });

    await transaction.commit();

    return { success: true, code: 200, data: { msg: "List deleted" } };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw new Error("Error deleting list: " + error.message);
  }
};

module.exports = {
  getListByAccountIdServices,
  createNewListServices,
  updateNewListServices,
  getListByAccountIdAndListIdServices,
  deleteListByAccountIdAndListIdServices,
};
