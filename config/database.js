import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// 👇 ADD THIS
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync(); // creates tables if missing
    console.log("✅ Database synced");
  } catch (err) {
    console.error("❌ Database error:", err);
  }
})();

export default sequelize;
