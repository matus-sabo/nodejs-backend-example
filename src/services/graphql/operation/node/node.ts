import { builder } from "../../schema/builder.js";

builder.interfaceType("Node", {
  resolveType: (parent, { ctx }) => {
    return parent.__typename;
  },
  fields: (t) => ({
    id: t.string({
      resolve: (parent, args, { ctx }) => {
        if (typeof parent.__typename !== "string") {
          throw new Error("Should not happen");
        }
        return ctx.call.graphql.encodeNodeId(parent.__typename, parent.id);
      },
    }),
    updatedAt: t.string({
      resolve: (parent) => {
        return new Date(parent.updatedAt).toISOString();
      },
    }),
    createdAt: t.string({
      resolve: (parent) => {
        return new Date(parent.createdAt).toISOString();
      },
    }),
  }),
});

builder.queryField("node", (t) =>
  t.field({
    type: "Node",
    nullable: true,
    args: { id: t.arg.string({ required: true }) },

    resolve: async (parent, args, { ctx }) => {
      const { type, id } = ctx.call.graphql.decodeNodeId(args.id);
      if (type === "User") {
        const node = await ctx.call.prisma.user.findUnique({ where: { id } });
        if (!node) {
          return null;
        }
        return {
          ...node,
          __typename: type,
        };
      }
      if (type === "Post") {
        const node = await ctx.call.prisma.post.findUnique({ where: { id } });
        if (!node) {
          return null;
        }
        return {
          ...node,
          __typename: type,
        };
      }
    },
  })
);
