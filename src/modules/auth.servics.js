import { ConflictException, NotFoundException, UnauthorizedException } from "../../common/utlities/response/error.responce.js";
import { userModel } from "../../database/models/users.js";
import { comapred, hashed } from "../../middleware/hash.js";
import jwt from "jsonwebtoken";

export const signUp=async(data)=>{
    let {userName, email, password}=data
    let existUser= await userModel.findOne({email})
    if (existUser){
        return ConflictException({message:"email already exist"})
    }
    let hashedPassword=await hashed(password,10)
    let addUser= await userModel.insertOne({userName,email, password:hashedPassword})
    return addUser
}

export const logIn= async(data)=>{
    let {email, password}= data
    let userData=await userModel.findOne({email})
    if (userData){
        let isMatched= await comapred(password, userData.password)
        if(isMatched){
            let token=jwt.sign({id: userData._id}, "route")
            return {token , userData}
        }
    }
    return NotFoundException({message:"user not found"})

}


export const userIdData= async(headers)=>{
    let {authorization}= headers
    if(!authorization){
        return UnauthorizedException("unaithorized")
    }
    let decode= await jwt.verify(authorization, "route")
    let userData= await userModel.findById({_id: decode.id})
    return userData
}