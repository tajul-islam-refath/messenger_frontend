import { Avatar, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatContext } from "../../context/ChatContext";
function ScrollableChats({ messages }) {
  const { user } = useContext(ChatContext);
  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((message, i) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <>
                <Tooltip
                  label={message.sender.name}
                  placement="bottom-start"
                  hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={message.sender.name}
                    src={message.sender.avatar}
                  />
                </Tooltip>
              </>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, message, i, user._id),
                marginTop: isSameUser(messages, message, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}>
              {message.text}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChats;
