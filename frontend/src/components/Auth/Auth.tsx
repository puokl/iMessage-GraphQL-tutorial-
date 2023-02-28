import { CreateUsernameData, CreateUserNameVariables } from "@/util/types";
import { useMutation } from "@apollo/client";
import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from "../../graphql/operations/user";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUserNameVariables
  >(UserOperations.Mutations.createUsername);

  // console.log("Here is data", data, loading, error);

  const onSubmit = async () => {
    if (!username) return;
    try {
      // createUsername mutation to send our username to the GraphQL API
      // await createUsername({ variables: { username } });
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }
      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        throw new Error(error);
      }
      toast.success("Username successfully created!");

      // reload session to obtain new username
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
      console.log("onSubmit error", error);
    }
  };

  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a username</Text>
            <Input
              placeholder="Enter a username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Button width="100%" onClick={onSubmit} isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">MessengerQL</Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={<Image height="20px" src="/images/googlelogo.png" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
    // <div>
    //   <Button onClick={() => signIn("google")}>Sign In</Button>
    // </div>
  );
};
export default Auth;
