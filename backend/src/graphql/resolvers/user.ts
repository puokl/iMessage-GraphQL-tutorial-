import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { ApolloError } from "apollo-server-core";
import { User } from "@prisma/client";

const resolvers = {
  // it can be a query, mutation or subscription resolver
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> => {
      const { username: searchedUsername } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        throw new ApolloError("Not authorized");
      }
      // we can use ApolloError or a custom error obj

      // we exclude ourself from the search
      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });
        return users;
      } catch (error: any) {
        console.log("SEARCHUSERS ERROR", error);
        throw new ApolloError(error?.message);
      }
    },
  },
  Mutation: {
    // _ when we have args that we don't really need
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;
      console.log("username", username);

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }
      // alias id to userId to make it more readable
      const { id: userId } = session.user;

      try {
        // check that username is not taken
        // run npx prisma generate --schema=src/prisma/schema.prisma to generate prisma client first
        // everytime we update the schema we have to rerun the command
        const existingUser = await prisma.user.findUnique({
          // it converts the logic of prisma into the query of the selected db (in this case mongo)
          where: {
            username,
          },
        });
        if (existingUser) {
          return {
            error: "Username already taken, Try another",
          };
        }
        // update user

        await prisma.user.update({
          where: {
            id: userId,
          },
          // 2nd params contains the actual update we're making into the user
          data: {
            username,
          },
        });
        return { success: true };
      } catch (error: any) {
        console.log("createUsername error", error);
        return {
          error: error?.message,
        };
      }
    },
  },
};

export default resolvers;
