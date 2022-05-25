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

// app express 사용 및 json 사용
const app = express();
app.use(express.json());

//도메인 허용
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
    LIMIT 2`);
  // 조회수 증가  
  await pool.query(`
  update wise_saying
  set views = views+1
  where id =?
  `,[rows.id]
  );
  res.json([rows]);
});

// 명언 좋아요 증가
app.patch("/wise_saying",async(req,res)=>{
  //현재 조회중인 id가져오기
  const {id}= req.body;
  //없으면 오류
  if(!id){
    res.status(400).json({
      msg : "id requred",
    });
    return res;
  }
  // 좋아요 증가
  await pool.query(
    `
    update wise_saying
    set good = good + 1
    where id = ?
    `,
    [id]
  );
  res.json({
    msg : `좋아요가 증가했습니다.`,
  });
});

// 명언 싫어요 증가
app.patch("/wise_saying/dislike",async(req,res)=>{
  //현재 조회중인 id가져오기
  const {id}= req.body;
  //없으면 오류
  if(!id){
    res.status(400).json({
      msg : "id requred",
    });
    return res;
  }
  // 싫어요 증가
  await pool.query(
    `
    update wise_saying
    set dislike = dislike + 1
    where id = ?
    `,
    [id]
  );
  res.json({
    msg : `싫어요가 증가했습니다.`,
  });
});

app.listen(port);