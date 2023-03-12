import {
  CreateConversationData,
  CreateConversationInput,
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
} from "@/util/types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
  Text,
  Stack,
  Input,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import UserOpeations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import { Session } from "next-auth";

// useQuery fires as soon as the component renders, useLazyQuery allows us to choose when it fires

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOpeations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation
    );
  console.log("HERE IS SEARCH DATA", data);

  // useLazyQuery manage the async nature of onSearch funct, so we can omit async here
  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
    console.log("inside on submit", username);
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipants = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const onCreateConversation = async () => {
    // transform the participants array into a participants.id array
    // const participantIds = participants.map((p) => p.id);
    // we have to add current user
    const participantIds = [userId, ...participants.map((p) => p.id)];
    try {
      // createConversation mutation
      const { data } = await createConversation({
        variables: {
          participantIds,
        },
      });
      console.log("HERE IS CONVERSATION DATA", data);
    } catch (error: any) {
      console.log("onCreateConversation error", error);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length != 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipants}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "brand.100" }}
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
