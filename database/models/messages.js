import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

const messageSchema=new Schema({
    message:{
        type: String,
        required: true,
        minLength:10,
        maxLength:500

    },
    receverId:{
        type: Types.ObjectId,
        ref:"users",
        required: true,

    },
    date:{
        type:Date,
        default: Date.now
    },
    image:{
        type:String
    }

},
   {timestamps:true}
)


export const messageModel= mongoose.model("messages", messageSchema)