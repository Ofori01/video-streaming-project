import z from "zod";

class Config {
  private static instance: Config;

  private _EnvSchema = z.object({
    backendUrl: z.string(),
    supabaseUrl: z.string().optional(),
    supabaseAnonKey: z.string().optional(),
  });

  private _env: z.infer<typeof this._EnvSchema>;

  private constructor() {
    //? might tweak for prod and dev

    const envServer = this._EnvSchema.safeParse({
      backendUrl: import.meta.env.VITE_BACKEND_URL,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    });

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
