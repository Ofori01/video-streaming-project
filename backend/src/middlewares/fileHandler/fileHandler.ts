import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads",
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname).toLocaleLowerCase();
    callback(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
  },
});

const upload = multer({ storage });

export const fileHandler = 
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]);
