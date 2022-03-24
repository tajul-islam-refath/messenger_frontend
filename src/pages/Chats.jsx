import { Box } from "@chakra-ui/layout";
import { useState, useContext } from "react";
import Chatbox from "../components/Chats/Chatbox";
import MyChats from "../components/Chats/MyChats";
import SideDrawer from "../components/Chats/SideDrawer";

import { ChatContext } from "../context/ChatContext";

function Chats() {
  const { user, isLoggedIn } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", height: "100vh" }} className="chats">
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chats;
