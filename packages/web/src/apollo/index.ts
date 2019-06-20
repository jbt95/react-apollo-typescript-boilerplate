import { createHttpLink } from "apollo-link-http";
import { ApolloClient, InMemoryCache } from "apollo-boost";
// import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: "https://localhost:4000",
});

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem("git-token");
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});
