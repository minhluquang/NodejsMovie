const { AccountDetail, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get an account_detail bu account ID
const getAccountDetailByAccountIDServices = async (account_id, transaction) => {
  try {
    const accountDetail = await AccountDetail.findOne({
      where: { account_id },
      transaction,
    });

    // Return if have no social network details
    if (!accountDetail || accountDetail.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No account detail found" },
      };
    }

    // Return if have social network details
    return { success: true, code: 200, data: accountDetail };
  } catch (error) {
    throw error;
  }
};

// Update an account detail by account_id
const updateAccountDetailServices = async (
  account_id,
  name,
  gender,
  description,
  profile_picture,
  transaction
) => {
  try {
    const accountDetail = await AccountDetail.findOne({
      where: { account_id },
      transaction,
    });

    // Return if have no account detail
    if (!accountDetail || accountDetail.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No account detail found" },
      };
    }

    accountDetail.gender = gender;
    accountDetail.name = name;
    accountDetail.description = description;
    accountDetail.profile_picture = profile_picture;
    accountDetail.updated_at = sequelize.literal(
      "CONVERT_TZ(NOW(), '+00:00', '+07:00')"
    );
    await accountDetail.save({ transaction });

    // Return if update succeed
    return { success: true, code: 200, data: accountDetail };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAccountDetailByAccountIDServices,
  updateAccountDetailServices,
};
