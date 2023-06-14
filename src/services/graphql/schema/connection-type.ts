import { ArgBuilder } from "@pothos/core";
import {
  ConnectionObjects,
  GraphqlSchema,
  NodeModel,
  builder,
} from "./builder.js";

builder.objectType("ConnectionPageInfo", {
  fields: (t) => ({
    hasNextPage: t.boolean({
      resolve: (parent) => {
        return parent.hasNextPage;
      },
    }),
    hasPreviousPage: t.boolean({
      resolve: (parent) => {
        return parent.hasPreviousPage;
      },
    }),
    startCursor: t.string({
      nullable: true,
      resolve: (parent) => {
        return parent.startCursor;
      },
    }),
    endCursor: t.string({
      nullable: true,
      resolve: (parent) => {
        return parent.endCursor;
      },
    }),
  }),
});

export function connectionType<
  C extends keyof ConnectionObjects,
  N extends keyof NodeModel
>(connectionName: C, nodeName: N) {
  const ConnectionEdge = builder.objectType(`${connectionName}Edge` as any, {
    fields: (t) => ({
      node: t.field({
        type: nodeName,
        resolve: (parent) => {
          return parent.node;
        },
      }),
      cursor: t.string({
        resolve: (parent) => {
          return parent.cursor;
        },
      }),
    }),
  });
  const Connection = builder.objectType(connectionName as any, {
    fields: (t) => ({
      edges: t.field({
        type: [ConnectionEdge],
        resolve: (parent) => parent.edges,
      }),
      nodes: t.field({
        type: [nodeName],
        resolve: (parent) => parent.nodes,
      }),
      pageInfo: t.field({
        type: "ConnectionPageInfo",
        resolve: (parent) => parent.pageInfo,
      }),
      totalCount: t.int({
        resolve: (parent) => parent.totalCount,
      }),
    }),
  });
  return Connection;
}

type TypesWithDefaults = PothosSchemaTypes.ExtendDefaultTypes<GraphqlSchema>;

export function connectionArgs(arg: ArgBuilder<TypesWithDefaults>) {
  return {
    first: arg.int(),
    last: arg.int(),
    before: arg.string(),
    after: arg.string(),
  };
}
