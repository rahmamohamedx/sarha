import { BadRequestException } from "../../../common/utlities/response/error.responce.js"
import { env } from "../../../config/env.service.js"
import { messageModel } from "../../../database/models/messages.js"
import {userModel} from "../../../database/models/users.js"


export const sendMessage=async(data, userId, file)=>{
  let{message}=data
  let existuser= await userModel.findById({_id:userId})
  if(!existuser){
    return({message:"user not sound"})
  }
  let image=" "
  if(file){
    image=`${env.basic_url}/uploads/general/${file.filename}`
  }
  let messageData= await messageModel.insertOne({message, image, receverId:userId})
  if(messageData){
    return messageData
  } throw BadRequestException({message:"messgae cant be added"})
}

export const allMessages=async(userId)=>{
      let existuser= await userModel.findById({_id:userId})
  if(!existuser){
    return({message:"user not found"})
  }
  let messages= await messageModel.find({receverId: userId})
  if(messages.length>0){
    return messages
  }  throw BadRequestException({message:"no messages"})
}

export const getMessage=async(messageId, userId)=>{
  let existmesaage= await messageModel.findById({_id:messageId, receverId:userId})
  if(!existmesaage){
   throw BadRequestException({message:"messgae cant be found"})
  }
    return existmesaage
} 


export const deletMessage=async(messageId, userId)=>{
  let existmesaage= await messageModel.findById({_id:messageId, receverId:userId})
  if(existmesaage){
    let delleted= await messageModel.deleteOne(existmesaage)
    return delleted
  }
   throw BadRequestException({message:"messgae cant be found"})
} 