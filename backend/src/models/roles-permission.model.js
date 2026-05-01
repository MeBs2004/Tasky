const mongoose = require("mongoose");
const { Permissions, Roles } = require("../enums/role.enum");
const { RolePermissions } = require("../utils/role-permission");

const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permission: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function () {
        return RolePermissions[this.name];
      },
    },
  },
  {
    timestamps: true,
  },
);

const RoleModel = mongoose.model("Role", roleSchema);

module.exports = RoleModel;
