const db = require("../../models");
const constants = require("../../constants/constant");

createUser = async function (body) {
  return await db[constants.DB.table.USER_MASTER].create(body);
};

updateUser = async function (obj, query) {
  await db[constants.DB.table.USER_MASTER].update(obj, {
    where: query,
  });
};

findUser = async function (mobileNo) {
  const user = await db[constants.DB.table.USER_MASTER].findOne({
    where: { mobileNo },
  });
  return user ? user.dataValues : null;
};

findMobileNo = async function (mobileNo) {
  const user = await db[constants.DB.table.VERIFICATION_MASTER].findOne({
    where: { mobileNo },
  });
  return user ? user.dataValues : null;
};

createEntryInVerificationMaster = async function (body) {
  console.log(body);
  return await db[constants.DB.table.VERIFICATION_MASTER].create(body);
};

updateInVerificationMaster = async function (obj, query) {
  await db[constants.DB.table.VERIFICATION_MASTER].update(obj, {
    where: query,     
  });
};

module.exports = {
  createUser,
  updateUser,
  findMobileNo,
  createEntryInVerificationMaster,
  updateInVerificationMaster,
  findUser
};
