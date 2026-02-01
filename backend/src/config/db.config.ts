import path from "path";
import { DataSource } from "typeorm";
import envConfig from "./env.config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envConfig.DATABASE_HOST,
  port: envConfig.DATABASE_PORT,
  username: envConfig.DATABASE_USER,
  password: envConfig.DATABASE_PASSWORD,
  database: envConfig.DATABASE,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
  subscribers: [],
  migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
});

export const initializeDb = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization", error);
    process.exit(1)
  }
};
