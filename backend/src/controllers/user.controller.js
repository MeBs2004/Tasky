const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const { HTTPSTATUS } = require("../config/http.config");
const { getCurrentUserService } = require("../services/user.service");

const getCurrentUserController = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  const { user } = await getCurrentUserService(userId);

  return res.status(HTTPSTATUS.OK).json({
    message: "User fetched successfully",
    user,
  });
});

module.exports = {
  getCurrentUserController,
};
