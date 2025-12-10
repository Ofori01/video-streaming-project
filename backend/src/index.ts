import "reflect-metadata";
import express, { Response } from "express";
import { initializeDb } from "./config/db.config";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler/ErrorHandler";
import envConfig from "./config/env.config";
import { en } from "zod/v4/locales";

const app = express();



app.use(express.json());


//TODO - ASK// use a container class for all repos and services so only a shared instance is available

app.use("/api", routes)
app.use(errorHandler)

//route not found
app.use((req, res:Response)=>{
  return res.status(404).send({
    message:"Route not found"
  })
}) 
//initialize db before server connection
initializeDb().then(()=>{
  app.listen(envConfig.PORT, async () => {
    console.log(`server started on port ${envConfig.PORT}`);
  });

})
