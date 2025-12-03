import "reflect-metadata"
import  express  from "express"
import { initializeDb } from "./config/db.config"

const app  =  express()

const PORT = 5000

app.listen(PORT, async()=>{
    console.log(`server started on port ${PORT}`)
    await initializeDb()
})
