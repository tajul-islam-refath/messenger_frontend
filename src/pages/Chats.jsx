import React, { Suspense, useState, useContext } from "react";
import { Box } from "@chakra-ui/layout";
import { ChatContext } from "../context/ChatContext";
const Chatbox = React.lazy(() => import("../components/Chats/Chatbox"));
const MyChats = React.lazy(() => import("../components/Chats/MyChats"));
const SideDrawer = React.lazy(() => import("../components/Chats/SideDrawer"));

function Chats() {
  const { user, isLoggedIn } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ width: "100%", height: "100vh" }} className="chats">
        {user && <SideDrawer />}
        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </Suspense>
  );
}

export default Chats;
