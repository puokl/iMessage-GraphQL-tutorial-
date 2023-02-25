import { Inter } from "next/font/google";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { Box } from "@chakra-ui/react";
import Auth from "@/components/Auth/Auth";
import Chat from "@/components/Chat/Chat";
import { Session } from "next-auth";
//  we can explore session object and extend it to add what we want.
// we create a custom type declaration file "/lib/next-auth.s.ts" name file has to match name of library

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  console.log("session", session);

  const reloadSession = () => {};
  return (
    <>
      <Box>
        {session?.user.id ? (
          <Chat />
        ) : (
          <Auth session={session} reloadSession={reloadSession} />
        )}
      </Box>
      {/* <div>
        {data?.user ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn("google")}>Sign In</button>
        )}

        {data?.user?.name}
      </div> */}
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  // everything inside props is passed to our component
  return {
    props: {
      session,
    },
  };
}
