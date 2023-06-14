import { builder } from "../../schema/builder.js";
import {
  connectionArgs,
  connectionType,
} from "../../schema/connection-type.js";

builder.objectType("User", {
  interfaces: ["Node"],
  fields: (t) => ({
    id: t.string({
      resolve: (parent, args, { ctx }) => {
        return ctx.call.graphql.encodeNodeId("User", parent.id);
      },
    }),
    name: t.expose("name", { type: "String" }),
  }),
});

connectionType("UserConnection", "User");

builder.queryField("users", (t) =>
  t.field({
    type: "UserConnection",
    args: {
      ...connectionArgs(t.arg),
    },
    resolve: async (parent, args, { ctx }) => {
      const baseArgs = {
        where: {},
      };
      const connection = await ctx.call.graphql.cursorConnection(
        (args) => ctx.call.prisma.user.findMany({ ...args, ...baseArgs }),
        () => ctx.call.prisma.user.count({ where: baseArgs.where }),
        ctx.call.graphql.connectionArgs(args)
      );
      return connection;
    },
  })
);
