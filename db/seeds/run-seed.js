const db = require("./../connection");
const seed = require("./seed");
const devData = require("./../data/development-data/users");

const runSeed = () => {
  return seed(devData).then(() => db.end);
};
runSeed();
