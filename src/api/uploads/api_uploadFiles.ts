import { Request, Response } from "express";
import { db_insert } from "../../db";
import { send_sqs } from "../sns_sqs/api";

type FilesObject = Express.Multer.File & {
    etag: string,
    key: string,
    storageClass: string,
    location: string
}

const api_uploadFiles = ({ files }: Request, res: Response) => {
    res.status(200);

    // Only for DB purposes
    if (Array.isArray(files)) {
        const [firstFile] = files as FilesObject[];
        if (process.env.DB_WRITE !== "false") {
            if ('etag' in firstFile && 'size' in firstFile) {
                const { etag, size, key, originalname, storageClass, location } = firstFile;
                db_insert({ etag, size, key, originalname, storageClass, location });
            }
        }
        send_sqs(firstFile.originalname + ' was uploaded');
    }
    return res.json({
        msg: "Uploaded!",
        files: files
    });
}

export default api_uploadFiles;