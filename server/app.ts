import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnet";
import { startApolloServer } from "./apollo/apolloServer";
import cookieParser from "cookie-parser";
dotenv.config({ path: "config/.env.local" });

const app = express();

app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 4040;

dbConnect();
startApolloServer(app);

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
