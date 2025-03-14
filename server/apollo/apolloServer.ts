import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Application, json } from "express";
import { roomTypeDefs } from "../graphql/typeDefs/room";
import { roomResolvers } from "../graphql/resolvers/room";

export const startApolloServer = async (app: Application) => {
  const typeDefs = [roomTypeDefs];
  const resolvers = [roomResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors({
      credentials: true,
      origin: ["http://localhost:5173"],
    }),
    json(),
    expressMiddleware(apolloServer)
  );
};
