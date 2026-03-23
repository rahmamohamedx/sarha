import jwt, { decode } from "jsonwebtoken";
import { decodedToken } from "../common/security/security.js";
import { UnauthorizedException } from "../common/utlities/response/error.responce.js";


export const auth= async(req, res, next)=>{
 let {authorization}=req.headers
    if(!authorization){
        return UnauthorizedException("unaithorized")
    }
    const [flag, token]= authorization.split(' ')
    switch (flag) {
        case "Basic":
        let data= Buffer.from(token, "base64").toString()
            let [email, password]= data=split(":")
            break;
    
        case "Bearer":
            let decodeData= await decodedToken(token)
            req.userId= decodeData.id
            next()
            break;
        default: 
        break;
    }
  
}





