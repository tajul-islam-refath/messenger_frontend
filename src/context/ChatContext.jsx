import { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setIsLoggedIn(false);
    } else {
      setUser(user);
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
