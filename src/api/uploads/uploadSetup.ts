import AWS from 'aws-sdk';
import multer, { FileFilterCallback } from "multer"
import multerS3 from "multer-s3";
import {Request} from 'express';
import { foldername } from '../../constants';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4'
});

export const S3 = new AWS.S3();
const isAllowedMimetype = (mime: string) => ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/x-ms-bmp', 'image/webp'].includes(mime.toString());
const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const fileMime = file.mimetype;
    if(isAllowedMimetype(fileMime)) {
        callback(null, true)
    } else {
        callback(new Error('Only image files allowed'))
    }
}

export const handleUploadMiddleware = multer({
    fileFilter,
    storage: multerS3({
        s3: S3,
        bucket: process.env.AWS_BUCKET_NAME!,
        // acl: 'public-read', // AccessControlListNotSupported: The bucket does not allow ACLs
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (_: Request, file: any, cb) {
            const finalPath = `${foldername}/${file.originalname}`;

            cb(null, finalPath );
        }
    })
});
