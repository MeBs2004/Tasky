const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const { z } = require("zod");
const { HTTPSTATUS } = require("../config/http.config");
const { joinWorkspaceByInviteService } = require("../services/member.service");

const joinWorkspaceController = asyncHandler(async (req, res, next) => {
  const inviteCode = z.string().parse(req.params.inviteCode);
  const userId = req.user?._id;
  const { workspaceId, role } = await joinWorkspaceByInviteService(
    userId,
    inviteCode,
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace joined successfully",
    workspaceId,
    role,
  });
});

module.exports = {
  joinWorkspaceController,
};
