export const foldername = "public_asset";

export const Queries = {
  createDB: "CREATE DATABASE mydb",
  createTable:"CREATE TABLE mydb.S3_Objects (" +
    "etag VARCHAR(255), " +
    "_key VARCHAR(255), " +
    "size INT, " +
    "storageClass VARCHAR(255), " +
    "originalname VARCHAR(255), " +
    "location VARCHAR(255) );",
  getAll: `SELECT * FROM mydb.S3_Objects`,
  insert: "INSERT INTO mydb.S3_Objects SET ?",
  deleteImg: "DELETE FROM mydb.S3_Objects WHERE _key=?"
};
