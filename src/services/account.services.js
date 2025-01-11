const { Account, sequelize } = require("../models");

// Get all account
const getAllAccountsServices = async () => {
  try {
    const accounts = await Account.findAll();

    // Return if have no account
    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        code: 404,
        data: { message: "No accounts found" },
      };
    }

    // Return if have account
    return { success: true, code: 200, data: accounts };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllAccountsServices,
};
