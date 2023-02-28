import { Inter } from "next/font/google";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { Box } from "@chakra-ui/react";
import Auth from "@/components/Auth/Auth";
import Chat from "@/components/Chat/Chat";

//  we can explore session object and extend it to add what we want.
// we create a custom type declaration file "/lib/next-auth.s.ts" name file has to match name of library

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  console.log("session", session);

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };
  return (
    <>
      <Box>
        {session?.user.username ? (
          <Chat session={session} />
        ) : (
          <Auth session={session} reloadSession={reloadSession} />
        )}
      </Box>
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
