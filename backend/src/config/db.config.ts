import path from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password123",
  database: "test",
  synchronize: true,
  logging: true,
  entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
  subscribers: [],
  migrations: [],
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
