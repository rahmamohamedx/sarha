import { Router } from "express";
import { SuccessResponse } from "../../../common/utlities/response/success.responce.js";
import { sendMessage, allMessages, getMessage, deletMessage } from "./message.service.js";
import { addMesaageSchema } from "./message.validation.js";
import { validation } from "../../../common/utlities/response/validation.js";
import {auth} from "../../../middleware/auth.js"
import { multer_local } from "../../../middleware/multer.js";
const router = Router();

router.post("/send_message/:id", multer_local().single("image"),validation(addMesaageSchema) ,async (req, res) => {
  let addMesaage = await sendMessage(req.body, req.params.id, req.file);
  return SuccessResponse({ res, message: "message added", data: addMesaage});
});

router.get("/get_all_messages",auth, async(req,res)=>{
    let messagesData= await allMessages(req.userId)
    return SuccessResponse({ res, message: "messages", data: messagesData});
})

router.get("/get_message/:id", auth, async (req, res) => {
  let message = await getMessage( req.params.id, req.userId);
  return SuccessResponse({ res, message: "message", data: message});
});


router.delete("/delet_message/:id", auth,async (req, res) => {
  let message = await deletMessage( req.params.id, req.userId);
  return SuccessResponse({ res, message: "message delleted"});
});



export default router