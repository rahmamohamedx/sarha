import { Router } from "express";
import {SuccessResponse} from "../../common/utlities/response/success.responce.js"
import { logIn, signUp, userIdData } from "./auth.servics.js";
const router= Router()

router.post("/sign_up", async(req,res)=>{
    let addUser= await signUp(req.body)
    return SuccessResponse({res, message:"user added", data:addUser})
})

router.post("/login", async(req,res)=>{
    let userData= await logIn(req.body)
    return SuccessResponse({res, message:"user data", data: userData})
})

router.get("/get_user_id", async(req,res)=>{
    let addUser= await userIdData(req.headers)
    return SuccessResponse({res, message:"user data", data:addUser})
})




export default router