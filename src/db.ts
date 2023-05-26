import mysql from "mysql2";
import { Request, Response } from "express";
import { Queries } from "./constants";

export interface Iimage {
  etag: string,
  size: number,
  key: string,
  originalname: string,
  storageClass: string,
  location: string
}
let conn: mysql.Connection;
const db_params = {
  host: process.env.MY_SQL_DB_HOST || "",
  user: process.env.MY_SQL_DB_USER || "",
  password: process.env.MY_SQL_DB_PASSWORD || "",
  port: Number(process.env.MY_SQL_DB_PORT) || 3306,
};

export const api_db_query = (req: Request, res: Response) => {
  execute(Queries.getAll, [], (err: Error, result: any) => {
    if (err) {
      return res.send("error connecting: " + err.stack);
    }
    res.send(result);
  });
};

export const execute = (
  query: string,
  params: string[] | Object,
  callback: Function
) => {
  // const queryString = "INSERT INTO ProductOrder (product_id, customer_id, product_quantity) VALUES (?, ?, ?)"
  conn = mysql.createConnection(db_params);
  if (!conn)
    callback(
      "Connection was not created. Ensure Connection is created when running the app."
    );

  conn.query(query, params, (err, result) => {
    if (err) {
      console.debug("------QUERY-----ERROR", err);
      callback(err);
    }

    callback(null, result);
  });
};

export const api_db = (req: Request, res: Response) => {
  const { obj } = req.query;
  const table = obj === "table";
  const query: string = table ? Queries.createTable : Queries.createDB;
  execute(query, [], (err: Error, result: any) => {
    if (err) {
      return res.send("error connecting: " + err.stack);
    }
    res.send(result);
  });
};


export const db_insert = ({ etag, size, key: _key, originalname, storageClass, location }: Iimage) => {
  execute(
    Queries.insert,
    { etag, size, _key, originalname, storageClass, location },
    (err: Error, result: any) => {
      if (err) {
        throw new Error("error connecting: " + err.stack);
      }
    }
  );
};
export const db_delete = (key: string) => {
  execute(Queries.deleteImg, key, (err: Error, result: any) => {
    if (err) {
      return("error connecting: " + err.stack);
    }
  }
  );
};
