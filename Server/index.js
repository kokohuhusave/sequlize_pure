import express from "express";
import cors from "cors";
import morgan from "morgan";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import {config} from "./config.js";
import {initSocket} from "./connection/socket.js";
import {sequelize} from "./db/database.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny")); // 사용자들이 들어오게되면 로그를 콘솔에 찍어줌

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
});

// db.getConnection().then((connection) => console.log(connection));

sequelize.sync().then(() => {
    // console.log(client); // sequelize 객체 출력됨
    const sever = app.listen(config.host.port);
    initSocket(sever);
});