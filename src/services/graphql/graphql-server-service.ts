import { createService, useContext } from "#app";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { builder } from "./schema/builder.js";

import "./operation/node/node.js";
import "./operation/post/create-post.js";
import "./operation/post/delete-post.js";
import "./operation/post/posts.js";
import "./operation/post/update-post.js";
import "./operation/user/create-user.js";
import "./operation/user/delete-user.js";
import "./operation/user/update-user.js";
import "./operation/user/users.js";

export const createGraphqlServerService = () => {
  const server = new ApolloServer({
    schema: builder.toSchema(),
  });
  const service = createService({
    name: "GraphqlServer",
    start: async () => {
      const ctx = useContext();
      await ctx.call.manager.startServices([ctx.services.prisma]);
      const { url } = await startStandaloneServer(server, {
        context: async (req) => {
          const graphqlCtx = useContext({ storage: {} });
          return {
            ctx: graphqlCtx,
          };
        },
        listen: { port: ctx.call.config.services.graphql.port },
      });
      service.log.info(`Apollo server url ${url}`);
    },
    stop: async () => {
      await server.stop();
    },
  });
  return {
    ...service,
  };
};
