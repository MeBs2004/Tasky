const RoleModel = require("../models/roles-permission.model");
const { RolePermissions } = require("./role-permission");

/**
 * Auto-seed roles on backend startup
 * This is idempotent - won't create duplicates
 * Ensures required roles always exist for user registration
 */
const autoSeedRoles = async () => {
  try {
    console.log("🌱 Checking required roles...");

    for (const roleName in RolePermissions) {
      const permissions = RolePermissions[roleName];

      const existingRole = await RoleModel.findOne({ name: roleName });

      if (!existingRole) {
        const newRole = new RoleModel({
          name: roleName,
          permission: permissions,
        });
        await newRole.save();
        console.log(`✅ Role "${roleName}" created with permissions`);
      } else {
        console.log(`✓ Role "${roleName}" already exists`);
      }
    }

    console.log("✅ Role seeding completed successfully\n");
  } catch (error) {
    console.error("❌ Error during role auto-seeding:", error.message);
    throw error;
  }
};

module.exports = autoSeedRoles;
