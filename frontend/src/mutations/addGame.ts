import gql from "graphql-tag";

export default gql`
  mutation CreateGame(
    $board: [Int!]!
    $categoryId: Int!
    $first: Int!
    $computerImage: Int!
    $userImage: Int!
    $level: Int!
    $result: Int!
    $winners: [Int!]!
  ) {
    createGame(
      board: $board
      categoryId: $categoryId
      first: $first
      computerImage: $computerImage
      userImage: $userImage
      level: $level
      result: $result
      winners: $winners
    ) {
      categoryId
    }
  }
`;
