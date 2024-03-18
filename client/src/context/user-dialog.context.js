import { createContext, useState } from "react";

export const UserDialogContext = createContext();

export default function UserDialogProvider({ children }) {
  const [user, SetUser] = useState({});

  const change = (type, data) => {
    SetUser((user) => ({
      ...user,
      [type]: data,
    }));
  };

  const set = (user) => SetUser(user);

  const clear = (user) => SetUser({});

  return (
    <UserDialogContext.Provider value={{ set, change, clear, user }}>
      {children}
    </UserDialogContext.Provider>
  );
}
