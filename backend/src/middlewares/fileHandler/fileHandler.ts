import multer from "multer";
import path from "path";
import { FILE_TYPE } from "../../lib/types/common/enums";
import CustomError from "../errorHandler/errors/CustomError";

// const storage = multer.diskStorage({
//   destination: "uploads",
//   filename(req, file, callback) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExt = path.extname(file.originalname).toLocaleLowerCase();
//     callback(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
//   },
// });

const storage = multer.memoryStorage()


const allowedFields  = Object.values(FILE_TYPE)

//TODO - add allowed file types
// const allowedImage = ['image/jpe', 'application/json']

const fileFilter: multer.Options["fileFilter"] = (req,file, cb) => {
  if(!allowedFields.includes(file.fieldname as FILE_TYPE)){
    return cb(new CustomError(`Unexpected field: ${file.fieldname}`, 400));
  }
   
  cb(null, true)
}

const upload = multer({ storage, fileFilter, limits: {
  fieldSize: 500000
} });

export const fileHandler = 
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]);
