import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "text/csv" &&
      file.mimetype !== "application/vnd.ms-excel"
    ) {
      return cb(new Error("Solo se permiten archivos CSV"));
    }
    cb(null, true);
  },
});
