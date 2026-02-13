import mongoose from "mongoose"
import { env } from "../config/env.service.js"

export const dataConnection = async () =>{
  const connection= await mongoose.connect(env.url).then(()=>{
    console.log("connected")
  }).catch((err)=>{
    console.log(err)
  })
}