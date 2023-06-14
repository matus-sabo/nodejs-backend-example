export const config = {
  logger: {
    levels: ["debug", "info", "warn", "error"],
  },
  services: {
    prisma: {
      url: "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
    },
    graphql: {
      port: 3000,
    },
  },
};
