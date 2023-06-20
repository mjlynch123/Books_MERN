const { User, Book } = require("../models"); // Update the path to your models
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth"); // Update the path to your auth file

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Fetch the user data from the database
        const userData = await User.findOne({ _id: context.user._id }).populate(
          "savedBooks"
        );
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      // Find the user based on the email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect email or password");
      }

      // Check if the password is correct
      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Incorrect email or password");
      }

      // Generate a token for the authenticated user
      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      // Create a new user in the database
      const user = await User.create({ username, email, password });

      // Generate a token for the newly created user
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link },
      context
    ) => {
      // Check if the user is authenticated
      if (context.user) {
        // Create a new book object
        const newBook = { authors, description, title, bookId, image, link };

        // Update the user's savedBooks array with the new book
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedBooks: newBook } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in to save a book");
    },
    removeBook: async (parent, { bookId }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Remove the book from the user's savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }

      throw new AuthenticationError(
        "You need to be logged in to remove a book"
      );
    },
  },
};

module.exports = resolvers;
