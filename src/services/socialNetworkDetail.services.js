const { SocialNetwork, SocialNetworkDetail, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get all social network detail
const getAllSocialDetailsServices = async () => {
  try {
    const socialNetworkDetails = await SocialNetworkDetail.findAll();

    // Return if have no social network details
    if (!socialNetworkDetails || socialNetworkDetails.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No social network details found" },
      };
    }

    // Return if have account
    return { success: true, code: 200, data: socialNetworkDetails };
  } catch (error) {
    throw error;
  }
};

// Get all social network detail by account_id
const getSocialNetworkDetailByAccountIDServices = async (account_id) => {
  try {
    const socialNetworkDetail = await SocialNetworkDetail.findAll({
      where: { account_id },
    });

    // Return if have no social network details
    if (!socialNetworkDetail || socialNetworkDetail.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No social network detail found" },
      };
    }

    // Return if have social network details
    return { success: true, code: 200, data: socialNetworkDetail };
  } catch (error) {
    throw error;
  }
};

const updateSocialNetworkDetailServices = async (
  platform,
  type,
  type_id,
  social_network_username,
  transaction
) => {
  // Select the value to query condition
  const whereCondition = {};
  if (type === "account_id") {
    whereCondition.account_id = type_id;
  } else if (type === "person_id") {
    whereCondition.person_id = type_id;
  } else if (type === "movie_id") {
    whereCondition.movie_id = type_id;
  } else if (type === "tv_series_id") {
    whereCondition.tv_series_id = type_id;
  }

  try {
    const result = await sequelize.query(
      `
      UPDATE social_network_details 
      INNER JOIN social_networks 
      ON social_network_details.social_network_id = social_networks.social_network_id
      SET social_network_details.social_network_username = :social_network_username,
          social_network_details.updated_at = CONVERT_TZ(NOW(), '+00:00', '+07:00')
      WHERE social_network_details.${type} = :type_id
        AND social_networks.platform = :platform
      `,
      {
        replacements: {
          social_network_username,
          type_id,
          platform,
        },
        type: sequelize.QueryTypes.UPDATE,
        transaction,
      }
    );

    // if affected rows = 0 => not found
    if (result[0] === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No records updated" },
      };
    }

    // Return if update succeed
    return {
      success: true,
      code: 201,
      data: "Social network detail updated successful",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllSocialDetailsServices,
  getSocialNetworkDetailByAccountIDServices,
  updateSocialNetworkDetailServices,
};
