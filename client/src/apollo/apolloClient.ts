import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_SERVER_URL,
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
