import { Request, Response } from "express";
import { db_insert } from "../../db";
import { send_sqs } from "../sns_sqs/api";

type FilesObject = Express.Multer.File & {
    etag: string,
    key: string,
    storageClass: string,
    location: string
}

const api_uploadFiles = ({ protocol, hostname, socket: { localPort }, files}: Request, res: Response) => {
    res.status(200);

    // Only for DB purposes
    if (Array.isArray(files)) {
        const [firstFile] = files as FilesObject[];
        const { etag, size, key, originalname, mimetype, storageClass, location } = firstFile;
        if (process.env.DB_WRITE !== "false") {
            if ('etag' in firstFile && 'size' in firstFile) {
                db_insert({ etag, size, key, originalname, storageClass, location });
            }
        }

        const fullUrl = `${protocol}://${hostname}:${localPort}`;
        const msg = `A new file was uploaded: 
        Name: ${originalname} 
        Size: ${size / 1000} kb
        Extension: ${mimetype}
        Download link: ${fullUrl}/download?file=${originalname}`;
        console.log('msg', msg);
        send_sqs(msg);
    }
    return res.json({
        msg: "Uploaded!",
        files: files
    });
}

export default api_uploadFiles;