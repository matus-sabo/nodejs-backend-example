import { createService, useContext } from "#app";
import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection";
import UNQ from "unique-names-generator";
import { createGraphqlServerService } from "./graphql-server-service.js";
import { NodeModel } from "./schema/builder.js";

export const createGraphqlService = () => {
  const service = createService({
    name: "Graphql",
    start: async () => {
      const ctx = useContext();
      await ctx.call.manager.startServices([ctx.services.graphql.server]);
    },
    stop: async () => {},
  });

  const encodeNodeId = (type: keyof NodeModel, id: string) => {
    return Buffer.from(JSON.stringify({ type, id })).toString("base64");
  };

  const decodeNodeId = (input: string) => {
    return JSON.parse(Buffer.from(input, "base64").toString("ascii")) as {
      type: keyof NodeModel;
      id: string;
    };
  };

  const connectionArgs = <
    T extends {
      first?: number | null;
      last?: number | null;
      before?: string | null;
      after?: string | null;
    }
  >(
    args: T
  ): T => {
    const limited = {
      first: args.first,
      last: args.last,
    };
    if (typeof args.first === "number" && args.first > 100) {
      args.first = 100;
    }
    if (typeof args.last === "number" && args.last > 100) {
      args.last = 100;
    }
    if (typeof args.first === "number" && args.first < 0) {
      args.first = 0;
    }
    if (typeof args.last === "number" && args.last < 0) {
      args.last = 0;
    }
    return {
      ...args,
      first: limited.first,
      last: limited.last,
    };
  };

  const generate = {
    name: () => {
      return UNQ.uniqueNamesGenerator({
        dictionaries: [UNQ.adjectives, UNQ.colors, UNQ.animals],
        separator: "-",
      });
    },
  };

  return {
    ...service,
    server: createGraphqlServerService(),
    call: {
      encodeNodeId,
      decodeNodeId,
      connectionArgs,
      generate,
      cursorConnection: findManyCursorConnection,
    },
  };
};
