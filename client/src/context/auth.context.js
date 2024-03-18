import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authForm, SetAuthForm] = useState({});
  const handleChangeAuthForm = (type, value) => {
    SetAuthForm((form) => ({
      ...form,
      [type]: value,
    }));
  };
  return (
    <AuthContext.Provider value={{ authForm, handleChangeAuthForm }}>
      {children}
    </AuthContext.Provider>
  );
}
