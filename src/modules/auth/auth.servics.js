import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../../common/utlities/response/error.responce.js";
import { userModel } from "../../../database/models/users.js";
import { comapred, hashed } from "../../../middleware/hash.js";
import { env } from "../../../config/env.service.js";
import jwt from "jsonwebtoken";
import {
  decodedRefreshToken,
  generateToken,
} from "../../../common/security/security.js";
import { OAuth2Client } from "google-auth-library";
import {set, get , redis_delet} from "../../../database/redis.service.js"
import { sendEmail } from "../../../common/email/email.sending.js";

export const signUp = async (data, file) => {
  let { userName, email, password, sharePorfileName } = data;
  let existUser = await userModel.findOne({ email });
  if (existUser) {
    return ConflictException({ message: "user already exist" });
  }
  let image = "";
  if (file) {
    image = `${env.basic_url}/uploads/general/${file.filename}`;
  }
  let hashedPassword = await hashed(password, 10);
  let addUser = await userModel.insertOne({
    userName,
    email,
    password: hashedPassword,
    sharePorfileName,
    image,
    deleteAt: Date.now() + 24 * 60 * 60 * 1000
  });
  let code = Math.ceil(Math.random() * 10000);
  code = code.toString().padEnd(4, 0);

  await set({
    key: `otp::${addUser._id}`,
    value: await hashed(code),
    ttl: 60 * 5,
  });

  await sendEmail({
    to: addUser.email,
    subjuct: "verify ur email",
    html: `<h1>verify ur email </h1>
  <p>${code}</p>`,
  })

  return addUser;
};

export const emailVerify= async(data)=>{
  let{code, email}=data
 let existUser = await userModel.findOne({ email });
  if (!existUser) {
    return ConflictException({ message: "user not found" });
  }
  let redis_code= await get(`otp::${existUser._id}`)
  if(comapred(code , redis_code)){
   existUser = await userModel.findByIdAndUpdate(existUser._id,{$set: { isVerified: true },$unset: { deleteAt: 1 }},{ new: true });
  await redis_delet(`otp::${existUser._id}`)
    return existUser
}
return BadRequestException("somthing went wrong")
};

export const  enableSteps=async(data)=>{
  let{email}=data
  const user = await userModel.findOne({email })
  if (!user) {
    throw new Error("User not found")
  }
  let otp = Math.ceil(Math.random() * 10000);
  otp = otp.toString().padEnd(4, 0);

  await set({
    key: `otp::${user._id}`,
    value: await hashed(otp),
    ttl: 60 * 5,
  });
    await sendEmail({
    to: user.email,
    subjuct: "enable 2 steps",
    html: `<h1>enable 2 steps </h1>
  <p>${otp}</p>`,
  })

}

export const stepsVerify=async(data)=>{
 let{otp, email}=data
 let existUser = await userModel.findOne({ email });
  if (!existUser) {
    return ConflictException({ message: "user not found" });
  }
  let redis_code= await get(`otp::${existUser._id}`)
  if(await comapred(otp , redis_code)){
   existUser = await userModel.findByIdAndUpdate( existUser._id, { twoStepEnabled: true },{ new: true }
  )
  await redis_delet(`otp::${existUser._id}`)
    return existUser
}
return BadRequestException("somthing went wrong")
};




export const logIn = async (data) => {
  let { email, password } = data;

  let userData = await userModel.findOne({ email });
  if (!userData) {
    throw BadRequestException({ message: "user not found" });
  }
  if (userData.banUntil && userData.banUntil > Date.now()) {
    throw new Error("Account banned. Try again later");
  }
  let isMatched = await comapred(password, userData.password);

  if (!isMatched) {
    userData.loginAttempts += 1;

    if (userData.loginAttempts >= 5) {
      userData.banUntil = Date.now() + 5 * 60 * 1000;
      userData.loginAttempts = 0;
    }

    await userData.save();
    throw BadRequestException({ message: "wrong password" });
  }

  userData.loginAttempts = 0;
  userData.banUntil = null;
  await userData.save();

  if (userData.twoStepEnabled == true) {
    let otp = Math.ceil(Math.random() * 10000);
    otp = otp.toString().padEnd(4, "0");

    await set({
      key: `otp::${userData._id}`,
      value: await hashed(otp),
      ttl: 60 * 5,
    });

    await sendEmail({
      to: userData.email,
      subjuct: "login otp",
      html: `<h1>Your OTP</h1>
      <p>${otp}</p>`,
    });

    return {message:"otp"};
  }
  let { accesToken, refreshToken } = generateToken(userData);

  return { accesToken, refreshToken };
};


export const loginConfirm = async (data) => {
 let{otp, email}=data
 let existUser = await userModel.findOne({ email });
  if (!existUser) {
    return ConflictException({ message: "user not found" });
  }
  let redis_code= await get(`otp::${existUser._id}`)
  if(await comapred(otp , redis_code)){
   let { accesToken, refreshToken } = generateToken(existUser);
    await redis_delet(`otp::${existUser._id}`)
    return { accesToken, refreshToken, existUser}
  }
return BadRequestException("wrong otp")
}



export const userIdData = async (userId) => {
  let userData = await userModel.findById({ _id: userId });
  if (userData) {
    return userData;
  }
  return NotFoundException({ message: "user not found" });
};

export const generatAcessToken = async (token) => {
  let decodeData = await decodedRefreshToken(token);
  let signature = undefined;
  switch (decodeData.aud) {
    case "Admin":
      signature = env.adminSignature;
      break;

    default:
      signature = env.userSignature;
      break;
  }
  let accesToken = jwt.sign({ id: decodeData.id }, signature, {
    expiresIn: "30m",
    audience: decodeData.aud,
  });
  return accesToken;
};

export const signupGoogle = async (data) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: data.idToken,
    audience: env.clientId,
  });
  const payload = ticket.getPayload();
};

export const forgetPass = async (data) => {
  let { email } = data;
  let existUser = await userModel.findOne({ email });
  if (!existUser) {
    throw BadRequestException("user not found");
  }
  let code = Math.ceil(Math.random() * 10000);
  code = code.toString().padEnd(4, 0);

  await set({
    key: `otp::${existUser._id}`,
    value: await hashed(code),
    ttl: 60 * 5,
  });

  await sendEmail({
    to: existUser.email,
    subjuct: "reset password",
    html: `<h1>reset password </h1>
  <p>${code}</p>`,
  });
  return "otp send";
};


export const resetPass = async(data) => {
  let { email, otp, password } = data;
    let existUser = await userModel.findOne({ email });
  if (!existUser) {
    throw BadRequestException("user not found");
  }
  let hashOtp= await get(`otp::${existUser._id}`)
  if(await comapred(otp, hashOtp)){
    if(await comapred(password, existUser.password)){
      throw BadRequestException("same pass")
    }
    let hashedPassword= await hashed(password)
    let updated= await userModel.findByIdAndUpdate(existUser._id, {password:hashedPassword})
    if(updated){
      await redis_delet(`otp::${existUser._id}`)
    } return updated
  }
 

};
