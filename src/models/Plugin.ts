import { DataTypes } from "sequelize";
import sequelize from "@/lib/db";

export const Plugin = sequelize.define("Plugin", {
  name: { type: DataTypes.STRING, allowNull: false },
  version: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
});
