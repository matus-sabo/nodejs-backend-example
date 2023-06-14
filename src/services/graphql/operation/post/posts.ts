import { builder } from "../../schema/builder.js";
import {
  connectionArgs,
  connectionType,
} from "../../schema/connection-type.js";

builder.objectType("Post", {
  interfaces: ["Node"],
  fields: (t) => ({
    id: t.string({
      resolve: (parent, args, { ctx }) => {
        return ctx.call.graphql.encodeNodeId("Post", parent.id);
      },
    }),
    title: t.expose("title", { type: "String" }),
    content: t.expose("content", { type: "String" }),
    author: t.field({
      type: "User",
      nullable: true,
      resolve: async (parent, args, { ctx }) => {
        const user = await ctx.call.prisma.user.findUnique({
          where: { id: parent.authorId },
        });
        return user;
      },
    }),
  }),
});

connectionType("PostConnection", "Post");

const PostConnectionFilterInput = builder.inputType(
  "PostConnectionFilterInput",
  {
    fields: (t) => ({
      authorId: t.string(),
    }),
  }
);

builder.queryField("posts", (t) =>
  t.field({
    type: "PostConnection",
    args: {
      ...connectionArgs(t.arg),
      filter: t.arg({ type: PostConnectionFilterInput }),
    },
    resolve: async (parent, args, { ctx }) => {
      const authorId = args.filter?.authorId
        ? ctx.call.graphql.decodeNodeId(args.filter.authorId).id
        : undefined;
      const baseArgs = {
        where: {
          authorId,
        },
      };
      const connection = await ctx.call.graphql.cursorConnection(
        (args) => ctx.call.prisma.post.findMany({ ...args, ...baseArgs }),
        () => ctx.call.prisma.post.count({ where: baseArgs.where }),
        ctx.call.graphql.connectionArgs(args)
      );
      return connection;
    },
  })
);
