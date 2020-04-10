import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import { people } from "../data.js";

const port = 4001;

const typeDefs = gql`
  type Person @key(fields: "id") {
    id: ID!
    name: String
  }

  extend type Query {
    person(id: ID!): Person
    people: [Person]
  }
`;

const resolvers = {
  Person: {
    __resolveReference(object) {
      return people.find((person) => person.id === object.id);
    },
  },
  Query: {
    person(_, { id }) {
      return people.find((person) => person.id === id);
    },
    people() {
      return people;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`People service ready at ${url}`);
});
