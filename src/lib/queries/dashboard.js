const db = require("../../models");
const constants = require("../../constants/constant");

createScore = async function (body) {
  return await db[constants.DB.table.SCORE_MASTER].create(body);
};

module.exports = {
  createScore
};
