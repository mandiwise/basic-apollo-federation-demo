import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import { films } from "../data.js";

const port = 4002;

const typeDefs = gql`
  type Film {
    id: ID!
    title: String
    actors: [Person]
    director: Person
  }

  extend type Person @key(fields: "id") {
    id: ID! @external
    appearedIn: [Film]
    directed: [Film]
  }

  extend type Query {
    film(id: ID!): Film!
    films: [Film]
  }
`;

const resolvers = {
  Film: {
    actors(film) {
      return film.actors.map((actor) => ({ __typename: "Person", id: actor }));
    },
    director(film) {
      return { __typename: "Person", id: film.director };
    },
  },
  Person: {
    appearedIn(person) {
      return films.filter((film) =>
        film.actors.find((actor) => actor === person.id)
      );
    },
    directed(person) {
      return films.filter((film) => film.director === person.id);
    },
  },
  Query: {
    film(_, { id }) {
      return films.find((film) => film.id === id);
    },
    films() {
      return films;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`Films service ready at ${url}`);
});
