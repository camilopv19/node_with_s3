import express, { Request, Response, NextFunction } from "express";
import { handleUploadMiddleware } from "./api/uploads/uploadSetup";
import api_uploadFiles from "./api/uploads/api_uploadFiles";
import api_deleteFiles from "./api/uploads/api_deleteFiles";
import api_ListFiles from "./api/uploads/api_listFiles";
import api_downloadFiles from "./api/downloads/api_downloadFiles";
import path from "path";
import { api_db, api_db_query } from "./db";

const router = express.Router();

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html")); //__dirname : It will resolve to your project folder.
});

router.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// DB functions
router.get("/db/query", api_db_query);
router.get("/db", api_db);

// Accept maximum 5 files
router.post(
  "/upload",
  handleUploadMiddleware.array("input_files", 5),
  api_uploadFiles
);

router.get("/download", api_downloadFiles);
router.delete("/remove", api_deleteFiles);
router.get("/list", api_ListFiles);

export default router;
