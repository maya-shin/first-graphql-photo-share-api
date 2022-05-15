const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { readFileSync } = require("fs");
const resolvers = require("./resolvers/resolver-index")
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8")

const app = express();
app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app });
};
startServer();

app.listen({ port: 4000 }, () =>
  console.log(`GraphQL Server running @ http://localhost:4000`)
);
