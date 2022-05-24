import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

// sql 접속
const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "wise_saying",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


const app = express();
app.use(express.json());

const corsOptions = {
origin: "https://cdpn.io",
optionsSuccessStatus: 200, 
  // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
const port = 3000;
// 명언 랜덤 조회
app.get("/wise_saying", async (req, res)=>{
  const [[rows]] = await pool.query(
    `SELECT * 
    FROM wise_saying
    ORDER BY RAND()
    LIMIT 1`);
  await pool.query(`
  update wise_saying
  set views = views+1
  where id =?
  `,[rows.id]
  );
  res.json([rows]);
});
app.listen(port);