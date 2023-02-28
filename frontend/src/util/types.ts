// type of data we get back from createUsername func
// structure of data returned by the useMutation hook

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
