import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db";

interface PostAttributes {
  id?: number;
  title: string;
  slug: string;
  content: string;
}

class Post extends Model<PostAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public slug!: string;
  public content!: string;
}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "posts",
  }
);

export default Post;
