import { Router } from "express";
import { SuccessResponse } from "../../../common/utlities/response/success.responce.js";
import {auth} from "../../../middleware/auth.js"
import { shareprofile, userProfile,updateData, deleteData , viewCount} from "./user.service.js";
import { multer_local } from "../../../middleware/multer.js";
const router = Router();

router.get("/share_link", auth, async (req,res)=>{
    let shareLink= await shareprofile(req.userId)
return SuccessResponse({ res, message: "user link", data: shareLink });
})

router.get("/get_user_data", async(req,res)=>{
     let userData = await userProfile(req.body)
     return SuccessResponse({ res, message: "user data", data: userData });
})

router.get("/view_count", auth, async(req,res)=>{
    let userData= await viewCount(req.userId)
    return SuccessResponse({ res, message: "user data", data: userData });

})

router.put("/update_profile",multer_local().single("image"),auth,async(req,res)=>{
    let userData= await updateData(req.userId, req.body, req.file)
         return SuccessResponse({ res, message: "user updated", data: userData });

})

router.delete("/delete_profile", auth, async(req,res)=>{
    let userDate= await deleteData(req.userId)
             return SuccessResponse({ res, message: "user deleted" });

    
})

export default router