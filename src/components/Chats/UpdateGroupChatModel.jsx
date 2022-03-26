import { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatContext } from "../../context/ChatContext.jsx";
import UserBadgeItem from "../../components/userListItem/UserBadgeItem";
import UserListItem from "../userListItem/UserListItem.jsx";

function UpdateGroupChatModel({ fetchAgain, setFetchAgain, getAllMessages }) {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loding, setLoding] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);

  const toast = useToast();

  const handleDelete = async (deletedUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      deletedUser._id !== user._id
    ) {
      toast({
        title: "Only Admin can remove a users",
        status: "warning",
        duration: 4000,
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

      const { data } = await axios.put(
        "/api/chat/removeFromGroup",
        {
          chatId: selectedChat._id,
          userId: deletedUser._id,
        },
        config
      );

      user._id === deletedUser._id
        ? setSelectedChat()
        : setSelectedChat(data.chat);

      setLoding(false);
      setFetchAgain(!fetchAgain);
      getAllMessages();
    } catch (e) {
      console.error(e);
      setLoding(false);
      toast({
        title: "Error Occured!",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  const handleAddUser = async (addedUser) => {
    if (selectedChat.users.find((u) => u._id === addedUser._id)) {
      toast({
        title: "User Already in group",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add new users",
        status: "warning",
        duration: 4000,
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

      const { data } = await axios.put(
        "/api/chat/addInGroup",
        {
          chatId: selectedChat._id,
          userId: addedUser._id,
        },
        config
      );

      setLoding(false);
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error Occured",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoding(false);
    }
  };

  const handelRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.put(
        "/api/chat/renameGroup",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error Occured",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };
  const handelSearch = async (query) => {
    setSearch(query);

    if (!query) {
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

      // console.log(data.users);

      setLoding(false);
      setSearchResult(data.users);
    } catch (err) {
      console.log(err);
      setLoding(false);
      toast({
        title: "Faild to load users",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box d="flex">
              {selectedChat.users.map((user) => (
                <>
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleDelete={() => handleDelete(user)}
                  />
                </>
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handelRename}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e) => handelSearch(e.target.value)}
              />
            </FormControl>

            {loding ? (
              <Box>
                <Spinner d="flex" justifyContent="center" mt={2} size="lg" />
              </Box>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  user={user}
                  key={user._id}
                  handelAccessChat={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDelete(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModel;
