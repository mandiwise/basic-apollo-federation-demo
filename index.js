import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

const port = 4000;

const gateway = new ApolloGateway({
  serviceList: [
    { name: "people", url: "http://localhost:4001" },
    { name: "films", url: "http://localhost:4002" },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
