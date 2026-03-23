import jwt, { decode } from "jsonwebtoken";
import {env} from "../../config/env.service.js"



export const generateToken=(user)=>{
    let signature= undefined
    let audience= undefined
    let refreshSignature= undefined
    switch (user.role) {
        case "0":
        signature= env.adminSignature
        refreshSignature= env.adminRefresh
        audience= "Admin"
           break;
           
        default:
            signature= env.userSignature
            refreshSignature= env.userRefresh
            audience="User"
            break;
    }
    let accesToken=jwt.sign({id: user._id}, signature, {
        expiresIn:"30m",
        audience
     } )
        let refreshToken=jwt.sign({id: user._id}, refreshSignature, {
        expiresIn:"1y",
        audience
     } )
     return {accesToken, refreshToken}
}


export const decodedToken=async(token)=>{
    let decode= await jwt.decode(token)
     let signature= undefined
       switch (decode.aud) {
        case "Admin":
            signature= env.adminSignature
            break;
       
        default:
            signature= env.userSignature
            break;
       }

    let decodeData=await jwt.verify(token,signature)
    return decodeData
}


export const decodedRefreshToken=async(token)=>{
    let decode= await jwt.decode(token)
     let refreshSignature= undefined
       switch (decode.aud) {
        case "Admin":
            refreshSignature= env.adminRefresh
            break;
       
        default:
            refreshSignature= env.userRefresh
            break;
       }

    let decodeData=await jwt.verify(token, refreshSignature)
    return decodeData
}