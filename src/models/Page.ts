// models/Page.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "@/lib/db";

class Page extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public slug!: string;
}

Page.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Page",
  }
);

export default Page;
