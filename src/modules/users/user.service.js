import { BadRequestException } from "../../../common/utlities/response/error.responce.js"
import { env } from "../../../config/env.service.js";
import { userModel } from "../../../database/models/users.js";

export const shareprofile=async(userId)=>{
  let userData = await userModel.findById({ _id: userId });
  if (!userData){
throw BadRequestException("user not found") 
 }
 let url=`${env.basic_url}/${userData.sharePorfileName}`
  return url
}

export const userProfile=async(data)=>{
let {sharePorfileName}= data
let name= sharePorfileName.split("/")[3]
if(name){
  let userdata= await userModel.findOne({sharePorfileName:name})
  return userdata
}
throw BadRequestException({message:"user not found"})
}

export const viewCount=async(userId)=>{
  let dataCount= await userModel.findByIdAndUpdate(userId,
    { $inc: { viewCount: 1 } },{ new: true })
  if(dataCount){
    return dataCount
  }throw BadRequestException({message: "user not found"})
}

export const updateData=async(userId, data, file)=>{
  let{fName, lName, gender, phone}=data
  console.log(data)
  let updated={}
  fName? updated.fName= fName :null
  lName? updated.lName= lName :null
  gender? updated.gender= gender :null
  phone? updated.phone= phone :null
  console.log(updateData)
  if(file){
    updated.image=`${env.basic_url}/uploads/general/${file.filename}`
  }
    let existUser= await userModel.findByIdAndUpdate(userId, updated)
 return existUser
 
}

export const deleteData=async(userId)=>{
  let userData= await userModel.findByIdAndDelete({_id:userId})
if(!userData){
   throw BadRequestException({message:"user not found"})
}
return userData
  
}
