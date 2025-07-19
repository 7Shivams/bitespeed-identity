import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import identifyRoute from "./routes/identifyRoute";
import { Pool } from "pg";

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", identifyRoute); 

const port = process.env.PORT 
const PSQL_DB_NAME = process.env.PSQL_DB_NAME 
const PSQL_DB_USER = process.env.PSQL_DB_USER
const PSQL_DB_HOST = process.env.PSQL_DB_HOST 
const PSQL_DB_PASSWORD = process.env.PSQL_DB_PASSWORD 
const PSQL_DB_PORT = process.env.PSQL_DB_PORT

export const pool = new Pool({
  database: PSQL_DB_NAME,
  user: PSQL_DB_USER,
  host: PSQL_DB_HOST,
  password: PSQL_DB_PASSWORD,
  port: Number(PSQL_DB_PORT),
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});