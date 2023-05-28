import express, { Request, Response, NextFunction } from "express";
import { handleUploadMiddleware } from "./api/uploads/uploadSetup";
import api_uploadFiles from "./api/uploads/api_uploadFiles";
import api_deleteFiles from "./api/uploads/api_deleteFiles";
import api_ListFiles from "./api/uploads/api_listFiles";
import api_downloadFiles from "./api/downloads/api_downloadFiles";
import path from "path";
import { api_db, api_db_query } from "./db";
import { api_poll, api_sns_sqs } from "./api/sns_sqs/api";

const router = express.Router();

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html")); //__dirname : It will resolve to your project folder.
});

router.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// DB functions: Uncomment lines in api_[upload/delete]Files.ts
router.get("/db/query", api_db_query);
router.get("/db", api_db);

// SQS/SNS functions
router.get("/email/:op", api_sns_sqs);
router.get("/poll", api_poll);

// Accept maximum 5 files (only BE/Postman)
router.post(
  "/upload",
  handleUploadMiddleware.array("input_files", 5),
  api_uploadFiles
);
router.get("/download", api_downloadFiles);
router.delete("/remove", api_deleteFiles);
router.get("/list", api_ListFiles);

export default router;
