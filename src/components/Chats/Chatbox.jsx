import { Box, useToast } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import SingleChat from "./SingleChat";

function Chatbox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      color="black"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default Chatbox;
