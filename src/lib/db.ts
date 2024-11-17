import { Sequelize } from "sequelize";

const sequelize = new Sequelize("cms_db", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  port: 3306, // Port number for MySQL
  logging: false, // Optional: Disable SQL query logging in the console
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synchronized successfully."))
  .catch((error) => console.error("Failed to synchronize database:", error));

export default sequelize;
