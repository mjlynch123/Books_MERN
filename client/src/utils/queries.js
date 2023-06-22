import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      _id
      authors
      description
      title
      bookId
      image
      link
    }
  }
`;
