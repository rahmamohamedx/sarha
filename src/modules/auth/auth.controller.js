import { Router } from "express";
import { SuccessResponse } from "../../../common/utlities/response/success.responce.js";
import {
  generatAcessToken,
  logIn,
  signUp,
  signupGoogle,
  userIdData,
  forgetPass,
  resetPass,
  emailVerify,
 enableSteps,
 stepsVerify,
 loginConfirm
} from "./auth.servics.js";
import { auth } from "../../../middleware/auth.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../../../common/utlities/response/validation.js";
import { multer_local } from "../../../middleware/multer.js";
const router = Router();

router.post( "/sign_up", multer_local().single("image"), validation(signupSchema),async (req, res) => {
    let addUser = await signUp(req.body, req.file);
    return SuccessResponse({ res, message: "user added", data: addUser });
  },
);

router.post("/verify", async(req,res)=>{
  let emailCode= await emailVerify(req.body)
    return SuccessResponse({ res, message: "email verified" , data:emailCode});
})

router.post("/2steps_enable", async (req, res) => {
  let user = await enableSteps(req.body);
  return SuccessResponse({ res, message: "otp sent" });
});

router.post("/2steps_verify", async (req, res) => {
  let user = await stepsVerify(req.body);
  return SuccessResponse({ res, message: "email verified" });
});


router.post("/login", validation(loginSchema), async (req, res) => {
  let userData = await logIn(req.body);
  return SuccessResponse({ res, message: "user data", data: userData });
});

router.post("/login_confirm",async (req, res) => {
  let userData  = await loginConfirm(req.body);
 return SuccessResponse({ res, message: "user data", data: userData });
});

router.get("/get_user_id", auth, async (req, res) => {
  let addUser = await userIdData(req.userId);
  return SuccessResponse({ res, message: "user data", data: addUser });
});

router.get("/generate_access_token", async (req, res) => {
  let { authorization } = req.headers;
  let data = await generatAcessToken(authorization);
  return SuccessResponse({ res, message: "access token created", data: data });
});

router.post("/signup/gmail", async (req, res) => {
  let data = await signupGoogle(req.body);
  return SuccessResponse({ res, message: "user added", data: data });
});

router.get("/forget_pass", async (req, res) => {
  let userdata = await forgetPass(req.body);
  SuccessResponse({res, message: "otp send" });
});

router.put("/reset_password", async (req, res) => {
  let userdata = await resetPass(req.body);
  SuccessResponse({res, message: "pass reset " });
});

export default router;
