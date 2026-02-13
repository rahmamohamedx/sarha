import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import { genderEnum, providerEnum } from "../../common/enum/enum.js";

const userSchema=new Schema({
    fName:{
        type: String,
        required: true,
        minLength:2,
        maxLength:20

    },
    lName:{
        type: String,
        required: true,
        minLength:2,
        maxLength:20

    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone: String,
    DOB: Date,
    gender:{
        type:String,
        enum:Object.values(genderEnum),
        default: genderEnum.male
    },
    provider:{
        type:String,
        enum:Object.values(providerEnum),
        default: providerEnum.service
    }

})

userSchema.virtual("userName").set(function(value){
    let[fName, lName]=value.split(" ")
    this.fName= fName
    this.lName=lName
}).get(function(){
    return` ${this.fName} ${this.lName}`
})

export const userModel= mongoose.model("users", userSchema)