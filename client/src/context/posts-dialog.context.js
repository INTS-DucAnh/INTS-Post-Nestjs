import { createContext, useState } from "react";

export const PostDialogContext = createContext();

export default function PostDialogProvider({ children }) {
  const [post, SetPost] = useState({});

  const change = (type, data) => {
    SetPost((post) => ({
      ...post,
      [type]: data,
    }));
  };

  const set = (post) => SetPost(post);

  const clear = () => SetPost({});

  return (
    <PostDialogContext.Provider value={{ post, change, set, clear }}>
      {children}
    </PostDialogContext.Provider>
  );
}
