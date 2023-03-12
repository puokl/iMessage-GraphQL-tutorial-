import { gql } from "@apollo/client";

// bang operator to make it required
// in graphql (vs rest) we don't have to search the entire entity, so in searchUsers we can get only id and username from user
export default {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
};
