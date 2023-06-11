const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "content")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {fileSize: 10000*100},
    fileFilter: ( req, file, cb) => {
        const fileTypes = /jpeg|png|mp4|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));

        if(mimeType && extname){
            return cb(null, true);
        }

        cb("only images supported");
    }
}).single("content");

module.exports = upload;