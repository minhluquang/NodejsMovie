require("dotenv/config");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const { Account, EmailConfirmation, sequelize } = require("../models");

const sendMailServices = (to, subject, htmlContent) => {
  const transport = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: to,
    subject: subject,
    html: htmlContent,
  };
  return transport.sendMail(options);
};

// verify emial address
const verifyEmailAddressServices = async (token) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findOne({
      where: { email: decoded.email },
      include: [{ model: EmailConfirmation }],
    });

    // Return if have no account => token fake
    if (
      !account ||
      account.length === 0 ||
      decoded.email !== account.EmailConfirmation.email
    ) {
      return { success: false, code: 404, data: { msg: "Invalid token" } };
    }

    if (account.EmailConfirmation.token === token) {
      return {
        success: false,
        code: 400,
        data: { msg: "This token has already been used." },
      };
    }

    const updateAccount = await Account.update(
      {
        is_verified: 1,
        updated_at: sequelize.literal("NOW()"),
        email_verify_at: sequelize.literal("NOW()"),
      },
      { where: { email: account.email }, returning: true, transaction }
    );

    if (updateAccount[0] === 0) {
      await transaction.rollback();
      return {
        success: false,
        code: 404,
        data: { msg: "No matching email found to update." },
      };
    }

    const updateEmailConfirmation = await account.EmailConfirmation.update(
      {
        token: token,
        updated_at: sequelize.literal("NOW()"),
      },
      { where: { email: account.email }, returning: true, transaction }
    );

    if (updateEmailConfirmation[0] === 0) {
      await transaction.rollback();
      return {
        success: false,
        code: 404,
        data: { msg: "No matching email found to update." },
      };
    }

    await transaction.commit();

    return {
      success: true,
      code: 200,
      data: { msg: "Email successfully verified" },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { sendMailServices, verifyEmailAddressServices };
