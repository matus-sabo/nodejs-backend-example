import { builder } from "../../schema/builder.js";

const CreatePostInput = builder.inputType("CreatePostInput", {
  fields: (t) => ({
    authorId: t.string({ required: true }),
    title: t.string(),
    content: t.string(),
  }),
});

builder.mutationField("createPost", (t) =>
  t.field({
    type: "Post",
    args: {
      input: t.arg({ type: CreatePostInput, required: true }),
    },
    resolve: async (parent, args, { ctx }) => {
      const title = args.input.title ?? ctx.call.graphql.generate.name();
      const content = args.input.content ?? ctx.call.graphql.generate.name();
      const authorId = ctx.call.graphql.decodeNodeId(args.input.authorId).id;
      const post = await ctx.call.prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
      });
      return post;
    },
  })
);
