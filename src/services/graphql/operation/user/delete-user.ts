import { builder } from "../../schema/builder.js";

builder.mutationField("deleteUser", (t) =>
  t.field({
    type: "User",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, { ctx }) => {
      const user = await ctx.call.prisma.user.delete({
        where: {
          id: args.id,
        },
      });
      return user;
    },
  })
);
