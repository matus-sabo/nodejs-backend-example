import { builder } from "../../schema/builder.js";

const UpdatePostInput = builder.inputType("UpdatePostInput", {
  fields: (t) => ({
    authorId: t.string(),
    title: t.string(),
    content: t.string(),
  }),
});

builder.mutationField("updatePost", (t) =>
  t.field({
    type: "Post",
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdatePostInput }),
    },
    resolve: async (parent, args, { ctx }) => {
      const id = ctx.call.graphql.decodeNodeId(args.id).id;
      const authorId = args.input?.authorId
        ? ctx.call.graphql.decodeNodeId(args.input.authorId).id
        : undefined;
      const title = args.input?.title ?? undefined;
      const content = args.input?.content ?? undefined;
      const post = await ctx.call.prisma.post.update({
        where: { id },
        data: {
          authorId,
          title,
          content,
        },
      });
      return post;
    },
  })
);
