import { createContext, useState } from "react";

export const CategoryDialogContext = createContext();

export default function CategoryDialogProvider({ children }) {
  const [category, SetCategory] = useState({});

  const change = (type, value) => {
    SetCategory((c) => ({
      ...c,
      [type]: value,
    }));
  };

  const set = (c) => {
    SetCategory(c);
  };

  const clear = () => SetCategory({});

  return (
    <CategoryDialogContext.Provider value={{ category, change, set, clear }}>
      {children}
    </CategoryDialogContext.Provider>
  );
}
