import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import Head from "next/head";
import React from "react";
import { getDataFromTree } from "react-apollo";
import { initApollo } from "./init-apollo";
import { isBrowser } from "./is-browser";
import parseCookie from "./parse-cookie";

const SERVER_LINK_OPTIONS = {
  uri: "http://localhost:4000/graphql",
  credentials: "include"
};

export default (App: any): React.FC => {
  const WithApollo = (props: any) => {
    const apolloClient: ApolloClient<NormalizedCacheObject> = initApollo({
      linkOptions: SERVER_LINK_OPTIONS,
      initialState: props.apolloState,
      options: {
        getToken: (): string => {
          return parseCookie().sid;
        }
      }
    });

    return <App {...props} apolloClient={apolloClient} />;
  };

  WithApollo.getInitialProps = async (ctx: any) => {
    const {
      Component,
      router,
      ctx: { res, req }
    } = ctx;

    const apollo = initApollo({
      linkOptions: SERVER_LINK_OPTIONS,
      initialState: {},
      options: {
        getToken: (): string => {
          return parseCookie(req).sid;
        }
      }
    });

    ctx.ctx.apolloClient = apollo;

    let appProps = {};
    if (App.getInitialProps) {
      appProps = await App.getInitialProps(ctx);
    }

    if (res && res.finished) {
      return {};
    }

    if (!isBrowser) {
      try {
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloClient={apollo}
          />
        );
      } catch (error) {
        console.error("Error while running `getDataFromTree`", error);
      }

      Head.rewind();
    }

    const apolloState = apollo.cache.extract();

    return {
      ...appProps,
      apolloState
    };
  };
  return WithApollo;
};
