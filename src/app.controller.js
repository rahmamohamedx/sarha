import express from "express"
import { dataConnection } from "../database/conection.js"
import { globalErrorHandler } from "../common/utlities/response/error.responce.js"
import authRouter from "./modules/auth/auth.controller.js"
import messageRouter from "./modules/message/message.controller.js"
import userRouter from "./modules/users/user.controller.js"
import cors from "cors"
import { connectionRdais } from "../database/redis.js"


export const bootstrabe=async ()=>{
    const app=express()
    app.use(express.json())
    app.use(cors())
    await connectionRdais()
    dataConnection()
    app.use("/auth", authRouter)
    app.use("/messages", messageRouter)
    app.use("/users", userRouter)
    app.use("/uploads", express.static("uploads"));
    app.use(globalErrorHandler)
    app.listen(3000,()=>{
        console.log("server is connected")
    })
}