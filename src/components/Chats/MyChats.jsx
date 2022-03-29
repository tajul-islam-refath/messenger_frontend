import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { getSender } from "../../config/ChatLogics";
import { ChatContext } from "../../context/ChatContext";
import CreateGroupModel from "./CreateGroupModel";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState({});
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useContext(ChatContext);

  const toast = useToast();

  const getAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/chat/allChats`,
        config
      );
      // console.log(data.chats);
      setChats(data.chats);
    } catch (e) {
      console.error(e);
      toast({
        title: "Faild to load chats",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    getAllChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
        pb={3}
        px={4}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        color="black"
        justifyContent="center"
        alignItems="center">
        MY Chats
        <CreateGroupModel>
          <Button
            d="flex"
            ml={6}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </CreateGroupModel>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden">
        {chats.length > 0 ? (
          <Stack overflow="scroll">
            {chats?.map((chat, i) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                d="flex"
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius="lg"
                key={i}>
                {!chat.isGroupChat && (
                  <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    // name={user.name}
                    src={getSender(loggedUser, chat.users).avatar}
                  />
                )}
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users).name
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text color="black" textAlign={"center"} e>
            No Chats found
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
