import multer from "multer";
import fs from "node:fs"
export const multer_local =({customePath}={customePath:"general"})=>{
    const storage=multer.diskStorage({
      destination:function( req, file ,cb){
        let path =`uploads/${customePath}`

        if(!fs.existsSync(path)){
            fs.mkdirSync(path,{recursive:true})
        }
        cb(null, path)
      },

      filename:function(req, file ,cb){
        let perfix= Date.now()
        let name= perfix+"-"+file.originalname
         cb(null, name)
      }
      

    })
    return multer({storage})
}

