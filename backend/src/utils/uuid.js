const { v4: uuid4 } = require("uuid");

function generateInviteCode() {
  return uuid4().replace(/-/g, "").substring(0, 8);
}

function generateTaskCode() {
  return `task-${uuid4().replace(/-/g, "").substring(0, 3)}`;
}

module.exports = {
  generateInviteCode,
  generateTaskCode,
};
