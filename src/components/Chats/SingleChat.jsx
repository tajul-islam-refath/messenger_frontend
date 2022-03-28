import "../styles/style.css";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
let latestSelectedChat, socket;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnect, setSocketConnect] = useState(false);
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const toast = useToast();

  const getAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.get(
        `/api/message/allMessages/${selectedChat._id}`,
        config
      );

      console.log(data);

      setLoading(false);
      setMessages(data.messages);
    } catch (e) {
      setLoading(false);
      console.error(e);
      toast({
        title: "Error Occured!",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message/sendMessage",
          {
            text: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);
        setMessages([...messages, data.message]);
        console.log(messages);
      } catch (e) {
        toast({
          title: "Error Occured!",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        console.error(e);
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedChat]);

  useEffect(() => {
    // socket connect
    socket = io(ENDPOINT);
    // send emit user
    socket.emit("setup", user);
    // accept response
    socket.on("response", () => {
      setSocketConnect(true);
    });
  }, []);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            <IconButton
              d={{ base: "flex" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              selectedChat && (
                <>
                  {getSender(user, selectedChat.users).name.toUpperCase()}
                  <ProfileModel user={getSender(user, selectedChat.users)} />
                </>
              )
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  getAllMessages={getAllMessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden">
            {/* messages */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChats messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E8E8E8"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3}>
            CLick on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
