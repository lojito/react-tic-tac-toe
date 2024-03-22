import gql from "graphql-tag";

export default gql`
  query getGames {
    games {
      _id
      categoryId
      computerImage
      userImage
      first
      level
      result
    }
  }
`;
