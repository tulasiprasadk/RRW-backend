import { Sequelize } from "sequelize";
import initModels from "../models/index.js";

/**
 * Sequelize instance
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,        // VERY IMPORTANT for Cloud Run
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * Initialize all models and associations ONCE
 */
const models = initModels(sequelize);

/**
 * Non-blocking DB bootstrap
 * Cloud Run safe: does NOT block startup
 */
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Database synced");
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    // ❌ DO NOT process.exit() on Cloud Run
  }
}

export { sequelize, models };
