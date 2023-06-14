import { builder } from "../../schema/builder.js";

const CreateUserInput = builder.inputType("CreateUserInput", {
  fields: (t) => ({
    name: t.string(),
  }),
});

builder.mutationField("createUser", (t) =>
  t.field({
    type: "User",
    args: {
      input: t.arg({ type: CreateUserInput }),
    },
    resolve: async (parent, args, { ctx }) => {
      const name = args.input?.name ?? ctx.call.graphql.generate.name();
      const user = await ctx.call.prisma.user.create({
        data: {
          name,
        },
      });
      return user;
    },
  })
);
