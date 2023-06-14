import { Context as AppContext } from "#app";
import SchemaBuilder from "@pothos/core";
import { Post, User } from "@prisma/client";

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
};

export type ConnectionType<T> = {
  nodes: T[];
  edges: {
    node: T;
    cursor: string;
  }[];
  pageInfo: PageInfo;
  totalCount: number;
};

type NodeInterface = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  __typename?: keyof NodeModel;
};

type Interfaces = {
  Node: NodeInterface;
};

export type NodeModel = {
  User: User;
  Post: Post;
};

export type ConnectionObjects = {
  UserConnection: ConnectionType<User>;
  PostConnection: ConnectionType<Post>;
};

interface Objects extends NodeModel, ConnectionObjects {
  ConnectionPageInfo: PageInfo;
}

type Context = {
  ctx: AppContext;
};

export type GraphqlSchema = {
  Interfaces: Interfaces;
  Objects: Objects;
  Context: Context;
};

export const builder = new SchemaBuilder<GraphqlSchema>({});

builder.queryType({});
builder.mutationType({});
