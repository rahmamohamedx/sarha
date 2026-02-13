import {hash, compare} from "bcrypt";

export const hashed=async(plaintext)=>{
 let hashedPassword= await hash(plaintext,10)
 return hashedPassword
}


export const comapred=async(plaintext, userpass)=>{
 let hashedPassword= await compare(plaintext, userpass)
 return hashedPassword
}