const { Router } = require("express");
const { getCurrentUserController } = require("../controllers/user.controller");

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);

module.exports = userRoutes;
