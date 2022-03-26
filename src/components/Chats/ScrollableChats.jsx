import { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isLastMessage } from "../../config/ChatLogics";
import { ChatContext } from "../../context/ChatContext";
function ScrollableChats({ messages }) {
  const { user } = useContext(ChatContext);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => <div style={{ display: "flex" }}></div>)}
    </ScrollableFeed>
  );
}

export default ScrollableChats;
