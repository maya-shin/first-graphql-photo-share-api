const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { readFileSync } = require("fs");
const resolvers = require("./resolvers/resolver-index");
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const startServer = async () => {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB);
  const db = client.db();
  const context = { db };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
  await server.start();
  server.applyMiddleware({ app });

  app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  app.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  );
};
startServer();

