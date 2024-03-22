import { createGame, deleteGame, getGame, getGames } from "./controllers/game";
import { DBGame } from "./types";

export const typeDefs = `#graphql
  type Game {
    _id: ID!
    board: [Int!]!
    categoryId: Int!
    first: Int!
    computerImage: Int!
    userImage: Int!
    level: Int!
    result: Int!
    winners: [Int!]!              
  }
  type Query {
    games: [Game]
    game(_id: ID!): Game
  }
  type Mutation {
    createGame(board: [Int!]!, categoryId: Int!, first: Int!, computerImage: Int!, userImage: Int!, level: Int!, result: Int!, winners: [Int!]!  ): Game
    deleteGame(_id: ID!): Game
  }
`;

export const resolvers = {
  Query: {
    games(_: undefined, args: {}, context: { req: { userId: string } }) {
      return getGames(context.req.userId);
    },
    game(
      _: undefined,
      args: { _id: string },
      context: { req: { userId: string } }
    ) {
      return getGame(args._id, context.req.userId);
    },
  },
  Mutation: {
    createGame(
      _: undefined,
      args: DBGame,
      context: { req: { userId: string } }
    ) {
      return createGame(args, context.req.userId);
    },
    deleteGame(
      _: undefined,
      args: { _id: string },
      context: { req: { userId: string } }
    ) {
      return deleteGame(args._id, context.req.userId);
    },
  },
};
