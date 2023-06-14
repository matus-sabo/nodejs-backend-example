import { PrismaClient } from "@prisma/client";

export const createPrismaClient = (options: { url: string }) => {
  return new PrismaClient({
    datasources: { db: { url: options.url } },
  });
};
