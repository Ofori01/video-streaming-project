import dotenv from "dotenv";
import z from "zod";

class Config {
  private static instance: Config;

  private _EnvSchema = z.object({
    PORT: z.coerce.number(),
    LOCAL_URL: z.string(),
    JWT_SECRET: z.coerce.string(),
    JWT_EXPIRES_IN: z.coerce.string()
    
  });

  private _env: z.infer<typeof this._EnvSchema>;

  private constructor() {
    //? might tweak for prod and dev
    dotenv.config();

    const envServer = this._EnvSchema.safeParse(process.env);

    if (!envServer.success) {
      console.error(envServer.error.issues);
      throw new Error(
        "There was an error with the server environment variables"
      );
    }
    this._env = envServer.data;
  }

  public static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public get config() {
    return this._env;
  }
}

export default Config.getInstance().config;
