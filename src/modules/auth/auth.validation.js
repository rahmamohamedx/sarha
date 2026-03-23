import joi from "joi"

export  const signupSchema= joi.object({
        userName: joi.string().min(3).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        gender:joi.string().optional(),
        sharePorfileName: joi.string().required()
       
})

export  const loginSchema= joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
       
})