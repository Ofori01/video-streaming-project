import { string } from "yup";
import dotenv from "dotenv";
import z from "zod";

class Config {
  private static instance: Config;

  private _EnvSchema = z.object({
    PORT: z.coerce.number(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.coerce.number(),
    DATABASE: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_POOL_MODE: z.string(),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BASE_URL: z.string(),
    AWS_CDN_BASE_URL: z.string().optional(),
    AWS_BUCKET: z.string(),
    // Nodemailer (optional — disabled in favour of Resend)
    NODEMAILER_USER: z.string().optional(),
    NODEMAILER_USER_PASSWORD: z.string().optional(),
    // Resend
    RESEND_API_KEY: z.string(),
    SUPABASE_URL: z.string().optional(),
    SUPABASE_ANON_KEY: z.string().optional(),
    REDIS_URL: z.string().optional(),
    FRONTEND_URL: z.string().default("*"),
    ENABLE_BULL_BOARD: z.string().optional().default("false"),
    ENABLE_VIDEO_UPLOAD_WORKER: z.string().optional().default("true"),
    ENABLE_MAIN_FLOW_WORKER: z.string().optional().default("true"),
    ENABLE_THUMBNAIL_UPLOAD_WORKER: z.string().optional().default("false"),
    ENABLE_UPLOAD_SESSION_CLEANUP_WORKER: z.string()
      .optional()
      .default("false"),
    ENABLE_DELETED_VIDEO_CLEANUP_WORKER: z.string()
      .optional()
      .default("false"),
  });

  private _env: z.infer<typeof this._EnvSchema>;

  private constructor() {
    //? might tweak for prod and dev
    dotenv.config();

    const envServer = this._EnvSchema.safeParse(process.env);

    if (!envServer.success) {
      console.error(envServer.error.issues);
      throw new Error(
        "There was an error with the server environment variables",
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
