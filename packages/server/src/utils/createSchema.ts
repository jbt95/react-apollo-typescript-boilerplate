import Container from "typedi";
import { buildSchema } from "type-graphql";

export function createSchema() {
  return buildSchema({
    resolvers: [] /*Graphql Resolvers*/,
    validate: false,
    container: Container,
  });
}
