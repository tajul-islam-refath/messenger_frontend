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
import Lottie from "react-lottie";
import annimationData from "../../annimations/86722-typing-animation.json";

const ENDPOINT = process.env.REACT_APP_BASE_URL;
// console.log(ENDPOINT);
// const ENDPOINT = "http://localhost:8000";

let latestSelectedChat, socket;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnect, setSocketConnect] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: annimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
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
        `${process.env.REACT_APP_BASE_URL}/api/message/allMessages/${selectedChat._id}`,
        config
      );

      // console.log(data);

      setLoading(false);
      setMessages(data.messages);
      socket.emit("join chat", selectedChat._id);
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
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/message/sendMessage`,
          {
            text: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // emit new message for backend
        socket.emit("new message", data.message);
        // console.log(data);
        setMessages([...messages, data.message]);
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

  useEffect(() => {
    // socket connect
    socket = io(ENDPOINT);
    // send emit user
    socket.emit("setup", user);
    // socket connect
    socket.on("response", () => {
      setSocketConnect(true);
    });

    // typing effect
    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      // console.log("stop typing");
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    getAllMessages();
    latestSelectedChat = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (
        !latestSelectedChat ||
        latestSelectedChat._id !== newMessage.chatId._id
      ) {
        //get notification
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
          console.log(newMessage);
          toast({
            title: "You get a new message",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnect) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let start = new Date().getTime();
    let timeLength = 3000;

    setTimeout(() => {
      let currentTime = new Date().getTime();
      let deffTime = currentTime - start;
      if (deffTime >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

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
              {isTyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={90}
                    style={{ marginLeft: 0 }}
                  />
                </div>
              )}
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
