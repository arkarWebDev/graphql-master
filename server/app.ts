import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnet";
import { startApolloServer } from "./apollo/apolloServer";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

const startService = async () => {
  await dbConnect();
  await startApolloServer(app);
};

startService().catch((err) => {
  console.log(err);
  process.exit(1);
});
