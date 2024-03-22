import gql from "graphql-tag";

export default gql`
  query GetGame($gameId: ID!) {
    game(_id: $gameId) {
      _id
      categoryId
      computerImage
      userImage
      first
      level
      board
      winners
      result
    }
  }
`;
