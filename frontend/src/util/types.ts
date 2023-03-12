// type of data we get back from createUsername func
// structure of data returned by the useMutation hook

// USERS

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}
// type of variable object we're passing into { variables: { username } }
export interface CreateUserNameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

// because in apollo queries we asked only for id and username from user
export interface SearchedUser {
  id: string;
  username: string;
}

// CONVERSATIONS

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

// this ts type reflects the grapqhl type in operations/conversation
// we have it already in grapqhl, but ts requires it
// $participantIds: [String]!)
export interface CreateConversationInput {
  participantIds: Array<string>;
}
