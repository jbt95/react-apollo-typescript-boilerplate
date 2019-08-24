import React from "react";
import withApolloClient from "../lib/with-apollo-client";
import CssBaseline from "@material-ui/core/CssBaseline";
import App, { Container, AppContext } from "next/app";
import { ApolloProvider } from "react-apollo";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props as any;
    return (
      <Container>
        <CssBaseline />
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
