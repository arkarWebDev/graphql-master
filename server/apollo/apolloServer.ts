import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Application, json, Request, Response } from "express";
import { roomTypeDefs } from "../graphql/typeDefs/room";
import { roomResolvers } from "../graphql/resolvers/room";
import { userTypeDefs } from "../graphql/typeDefs/user";
import { userResolvers } from "../graphql/resolvers/user";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "../middlewares/permissions";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { bookingTypeDefs } from "../graphql/typeDefs/booking";
import { bookingResolvers } from "../graphql/resolvers/booking";
import { paymentTypeDefs } from "../graphql/typeDefs/payment";
import { paymentResolver } from "../graphql/resolvers/payment";
import { webhookHandler } from "../controllers/payment";
import { reviewTypeDefs } from "../graphql/typeDefs/review";
import { reviewResolvers } from "../graphql/resolvers/review";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import dotenv from "dotenv";
dotenv.config();

type JWTPayload = {
  _id: string;
};

export const startApolloServer = async (app: Application) => {
  const typeDefs = [
    roomTypeDefs,
    userTypeDefs,
    bookingTypeDefs,
    paymentTypeDefs,
    reviewTypeDefs,
  ];
  const resolvers = [
    roomResolvers,
    userResolvers,
    bookingResolvers,
    paymentResolver,
    reviewResolvers,
  ];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const schemaWithShield = applyMiddleware(schema, permissions);

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const wsCleanup = useServer(
    {
      schema: schemaWithShield,
    },
    wsServer
  );

  const apolloServer = new ApolloServer({
    schema: schemaWithShield,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL!],
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }: { req: Request; res: Response }) => {
        let user = null;
        const token = req.cookies?.token;

        if (token) {
          try {
            const decodedToken = jwt.verify(
              token,
              process.env.JWT_SECRET!
            ) as JWTPayload;
            user = await User.findById(decodedToken._id);
            console.log("Authenticated user:", user?.email || "not found");
            if (!user) {
              // throw new Error("User not found.");
            }
          } catch (error) {
            // throw new Error("Invaild token or expired token.");
          }
        }
        return { req, res, user };
      },
    })
  );

  app.post("/api/payment/webhook", async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    const rawBody = req.rawBody;

    const isSuccess = await webhookHandler(signature, rawBody);
    if (isSuccess) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  });

  const PORT = process.env.PORT || 4040;

  httpServer.listen(PORT, () => {
    console.log("Server is running on PORT: ", PORT);
  });
};
