require("dotenv").config();
import "reflect-metadata";
import * as session from "express-session";
import * as cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as querystring from "querystring";
import * as TypeOrm from "typeorm";
import fetch from "node-fetch";
import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "graphql-extensions";
import { ResolverContext } from "./types/apolloContext";
import { createSchema } from "./utils/createSchema";
import { createTypeormConn } from "./utils/createTypeormConn";
import { Container } from "typedi";

const initServer = async () => {
  try {
    const app = express();

    TypeOrm.useContainer(Container);

    const conn = await createTypeormConn();

    const server = new ApolloServer({
      schema: await createSchema(),
      formatError: error => ({
        message: error.message,
        locations: error.locations,
        path: error.path,
      }),
      context: ({ req, res }: any): ResolverContext => {
        return {
          res: res,
          req: req,
        };
      },
      formatResponse: (response: GraphQLResponse) => {
        console.log(response.data);
        return response;
      },
    });

    app.use(
      cors({
        credentials: true,
        origin: "http://localhost:3000",
      })
    );

    app.use(
      session({
        name: "sid",
        secret: "skdjsikdjsidjspd",
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
      })
    );

    app.use(cookieParser());
    app.use(bodyParser.json());

    server.applyMiddleware({ app, path: "/graphql", cors: false });

    app.listen({ port: 4000 }, () => {
      console.log(
        `> Server ready at http://localhost:4000${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

initServer();
