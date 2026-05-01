const { UnauthorizedException } = require("./appError");
const { RolePermissions } = require("./role-permission");

const roleGuard = (role, requiredPermission) => {
  const permission = RolePermissions[role];

  const hasPermission = requiredPermission.every((permis) =>
    permission.includes(permis),
  );

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You dont have necessary permission to perform this action",
    );
  }
};

module.exports = {
  roleGuard,
};
