import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { createHttpLink, HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import { isBrowser } from "./is-browser";

type ApolloClientsCache = {
  [key: string]: ApolloClient<NormalizedCacheObject>;
};

interface CreateClientParams {
  linkOptions: HttpLink.Options;
  initialState: any;
  options: {
    getToken: () => string;
  };
}

const apolloClientsMap: ApolloClientsCache = {};

if (!isBrowser) {
  (global as any).fetch = fetch;
}

function create({
  linkOptions,
  initialState,
  options
}: CreateClientParams): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink(linkOptions);
  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
  const authLink = setContext((_, { headers }) => {
    const token = options.getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export function initApollo(
  params: CreateClientParams
): ApolloClient<NormalizedCacheObject> {
  if (!isBrowser) {
    return create(params);
  }
  if (!apolloClientsMap[params.linkOptions.uri as string]) {
    apolloClientsMap[params.linkOptions.uri as string] = create(params);
  }
  return apolloClientsMap[params.linkOptions.uri as string];
}
