import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";

@Injectable()
export class S3Service {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      region: process.env.S3REGION,
    });
  }

  async uploadImageOnS3(path: string, file: any): Promise<string> {
    const fileName = `${path}${Date.now()}-${file.originalname.trim()}`;
    const params: S3.PutObjectRequest = {
      Bucket: process.env.S3BUCKET,
      Key: fileName,
      Body: file.buffer,
    };

    try {
      await this.s3.upload(params).promise();
      return `/${fileName}`;
    } catch (error) {
      console.log(`UploadImageOnS3 error ->> ${error}`);
      throw error;
    }
  }

  async deleteImageFromS3(fullPaths: string[]): Promise<void> {
    if (!fullPaths || fullPaths.length === 0) {
      throw new Error("FILE_NOT_FOUND");
    }

    const fileNames = fullPaths.map((path) => ({
      Key: path.replace(process.env.S3GETURL + "/", ""),
    }));

    const params: S3.Types.DeleteObjectsRequest = {
      Bucket: process.env.S3BUCKET,
      Delete: {
        Objects: fileNames,
        Quiet: false,
      },
    };

    try {
      const data = await this.s3.deleteObjects(params).promise();
      console.log("Delete image successfully...", data);
    } catch (err) {
      console.error("Error:", err);
    }
  }
}
