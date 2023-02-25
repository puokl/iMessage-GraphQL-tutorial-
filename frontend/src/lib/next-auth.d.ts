import "next-auth";

// by using declare module keyword we are able to add custom types and interfaces to the next-auth
// library and modify types and interfaces that exists in that library
// we don't have to declare the other values ( expires, email) beacuse it will merge automatically
declare module "next-auth" {
  interface Session {
    user: User;
  }
  interface User {
    id: string;
    username: string;
  }
}
