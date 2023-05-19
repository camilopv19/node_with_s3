export const foldername = "public_asset"; 

const main = {
  MY_SQL_DB_HOST: "",
  MY_SQL_DB_USER: "",
  MY_SQL_DB_PASSWORD: "",
  MY_SQL_DB_PORT: 3306,
  MY_SQL_DB_DATABASE: "",
  MY_SQL_DB_CONNECTION_LIMIT: "4",
};
export const DATA_SOURCES = {
  mySqlDataSource: {
    DB_HOST: main.MY_SQL_DB_HOST,
    DB_USER: main.MY_SQL_DB_USER,
    DB_PASSWORD: main.MY_SQL_DB_PASSWORD,
    DB_PORT: main.MY_SQL_DB_PORT,
    DB_DATABASE: main.MY_SQL_DB_DATABASE,
    DB_CONNECTION_LIMIT: main.MY_SQL_DB_CONNECTION_LIMIT
      ? parseInt(main.MY_SQL_DB_CONNECTION_LIMIT)
      : 4,
  },
};

export const Queries = {
    createDB:`CREATE DATABASE mydb`,
    createTable:`CREATE TABLE S3_Objects (
    ETag VARCHAR(255),
    ObjKey VARCHAR(255),
    LastModified VARCHAR(255),
    Size INT,
    StorageClass VARCHAR(255),
    location VARCHAR(255)
    )`,
    getAll:`SELECT * FROM S3_Objects`,
};
