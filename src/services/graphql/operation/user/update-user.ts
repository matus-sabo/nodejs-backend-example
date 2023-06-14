import { builder } from "../../schema/builder.js";

const UpdateUserInput = builder.inputType("UpdateUserInput", {
  fields: (t) => ({
    name: t.string(),
  }),
});

builder.mutationField("updateUser", (t) =>
  t.field({
    type: "User",
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdateUserInput }),
    },
    resolve: async (parent, args, { ctx }) => {
      const id = ctx.call.graphql.decodeNodeId(args.id).id;
      const name = args.input?.name ?? undefined;
      const user = await ctx.call.prisma.user.update({
        where: { id },
        data: {
          name,
        },
      });
      return user;
    },
  })
);
