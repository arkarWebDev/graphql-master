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

type JWTPayload = {
  _id: string;
};

export const startApolloServer = async (app: Application) => {
  const typeDefs = [roomTypeDefs, userTypeDefs];
  const resolvers = [roomResolvers, userResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const schemaWithShield = applyMiddleware(schema, permissions);

  const apolloServer = new ApolloServer({
    schema: schemaWithShield,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors({
      credentials: true,
      origin: ["http://localhost:5173"],
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

            if (!user) {
              throw new Error("User not found.");
            }
          } catch (error) {
            throw new Error("Invaild token or expired token.");
          }
        }
        return { req, res, user };
      },
    })
  );
};
