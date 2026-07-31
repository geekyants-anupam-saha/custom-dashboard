import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const url = process.env.NEXT_PUBLIC_STRAPI_URL;
const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${url}/graphql`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      pollInterval: 60000, // Poll data every 60 seconds (60000 milliseconds)
    },
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export default client;
