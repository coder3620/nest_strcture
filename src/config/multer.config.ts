// import { diskStorage } from "multer";

// export const MulterConfig = {
//   storage: diskStorage({
//     destination: "./sandbox-closwap/",
//     filename: (req, file, callback) => {
//       // Generate a unique filename based on the originalname
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const originalname = file.originalname || ""; // Ensure originalname is defined
//       const fileName = `${uniqueSuffix}-${originalname}`;

//       callback(null, fileName);
//     },
//   }),
// };

// --------------------  for s3 images --------------------

// import { memoryStorage } from "multer";

// export const MulterConfig = {
//   storage: memoryStorage(),
// };

// --------------------------------------------------------

import { diskStorage } from "multer";
import { extname } from "path";
import { Request } from "express";

const allowedFileTypes = [".jpeg", ".png", ".jpg"];

export const MulterConfig = {
  storage: diskStorage({
    destination: "./uploads",
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) => {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      if (allowedFileTypes.includes(fileExtension.toLowerCase())) {
        // callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
        callback(null, `${file.originalname}`);
      } else {
        callback(
          new Error(
            "Invalid file type. Only .jpeg, .png, and .jpg are allowed."
          ),
          ""
        );
      }
    },
  }),
};
