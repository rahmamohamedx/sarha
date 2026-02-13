import express from "express"
import { dataConnection } from "../database/conection.js"
import { globalErrorHandler } from "../common/utlities/response/error.responce.js"
import userRouter from "./modules/auth.controller.js"

export const bootstrabe=()=>{
    const app=express()
    app.use(express.json())
    dataConnection()
    app.use(globalErrorHandler)
    app.use("/users", userRouter)
    app.listen(3000,()=>{
        console.log("server is connected")
    })
}