import mysql from "mysql2";
import { Request, Response } from "express";
import { DATA_SOURCES, Queries } from "./constants";

const dataSource = DATA_SOURCES.mySqlDataSource;
let conn: mysql.Connection;

export const api_db = (req: Request, res: Response) => {
  conn = mysql.createConnection({
    host: dataSource.DB_HOST,
    user: dataSource.DB_USER,
    password: dataSource.DB_PASSWORD,
    port: dataSource.DB_PORT,
  });
  conn.connect(function (err) {
    if (err) {
      console.debug("--------------ERROR", err);
      res.status(204).send("error connecting: " + err.stack);
    }
    console.debug("Connected!");
    return res
      .status(200)
      .json({ msg: "MySql Adapter Connection generated successfully" });
  });
};

export const execute = (
  query: string,
  params: string[] | Object,
  callback: Function
) => {
  // const queryString = "INSERT INTO ProductOrder (product_id, customer_id, product_quantity) VALUES (?, ?, ?)"
  conn = mysql.createConnection({
    host: dataSource.DB_HOST,
    user: dataSource.DB_USER,
    database: dataSource.DB_DATABASE,
    password: dataSource.DB_PASSWORD,
    port: dataSource.DB_PORT,
  });
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

export const api_db_create = (req: Request, res: Response) => {
  const query: string = Queries.createTable;
//   const query: string = Queries.createDB;
  execute(query, [], (err: Error, result: any) => {
    if (err) {
      return res.send("error connecting: " + err.stack);
    }
    res.send(result);
  });
};
