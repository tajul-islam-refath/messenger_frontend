import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModel from "./ProfileModel";
import { ChatContext } from "../../context/ChatContext";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userListItem/UserListItem";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoding] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handelSearch = async () => {
    if (!search) {
      toast({
        title: "Enter something in the search box",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoding(true);

      const config = {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data.users);
      setLoding(false);
    } catch (e) {
      console.log(e);
      toast({
        title: "Faild to load search results",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoding(false);
    }
  };

  const accessChat = async (id) => {
    setLoadingChat(true);
    try {
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.post(
        `/api/chat/accessChat`,
        { userId: id },
        config
      );

      console.log(data);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (err) {
      console.log(err);
      toast({
        title: "Faild to open chat",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="var()"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text
              d={{ base: "none", md: "flex" }}
              style={{ marginLeft: "6px" }}
              px="4">
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2x1">Messenger</Text>
        <div>
          <Menu>
            <MenuButton p="1">
              <BellIcon />
            </MenuButton>
            <MenuList className="my-menu-list">
              <MenuItem>Download</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={"sm"} cursor="pointer" name={user.name} />
            </MenuButton>
            <MenuList className="my-menu-list">
              <ProfileModel user={user}>
                {" "}
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              <MenuItem onClick={logutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" p={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                p={3}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handelSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : searchResult ? (
              searchResult.map((user, index) => (
                <UserListItem
                  key={index}
                  user={user}
                  handelAccessChat={() => accessChat(user._id)}
                />
              ))
            ) : (
              <span>Chats Not found</span>
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
