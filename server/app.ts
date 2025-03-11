import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnet";
import { startApolloServer } from "./apollo/apolloServer";
dotenv.config({ path: "config/.env.local" });

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4040;

dbConnect();
startApolloServer(app);

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
