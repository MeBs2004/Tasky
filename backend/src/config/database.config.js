const mongoose = require("mongoose");
const { config } = require("./app.config");

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to Mongo Database");
  } catch (error) {
    console.log("Error connecting to Mongo database");
    process.exit(1);
  }
};

module.exports = connectDatabase;
