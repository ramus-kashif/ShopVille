import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    //1aa6745d-1af5-421c-9612-cb130725463d.png
    const newFileName = uuidv4() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

export const upload = multer({ storage: storage });
