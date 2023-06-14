import { builder } from "../../schema/builder.js";

builder.mutationField("deletePost", (t) =>
  t.field({
    type: "Post",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, { ctx }) => {
      const post = await ctx.call.prisma.post.delete({
        where: {
          id: args.id,
        },
      });
      return post;
    },
  })
);
