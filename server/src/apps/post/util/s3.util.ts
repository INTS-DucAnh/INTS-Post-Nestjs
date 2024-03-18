import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ImagesToS3 } from '../dto/post-image.dto';

@Injectable()
export class S3Utils {
  static async uploadImageToS3(images: ImagesToS3[], bucketName: string) {
    const s3 = new S3();
    const uploadPromises = images.map((image) => {
      const params = {
        Bucket: bucketName,
        Key: image.filename,
        Body: image.image.buffer,
      };

      return s3.upload(params).promise();
    });
    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async deleteImageFromS3(filenames: string[], bucketName: string) {
    const s3 = new S3();
    const deleteImage = filenames.map((file: string) => {
      let params = {
        Bucket: bucketName,
        Key: file,
      };
      return s3.deleteObject(params).promise();
    });

    try {
      const results = await Promise.all(deleteImage);
      return results;
    } catch (error) {
      throw error;
    }
  }
}
