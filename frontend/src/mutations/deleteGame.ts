import gql from "graphql-tag";

export default gql`
  mutation DeleteGame($gameId: ID!) {
    deleteGame(_id: $gameId) {
      _id
    }
  }
`;
