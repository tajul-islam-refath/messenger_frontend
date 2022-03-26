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
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatContext } from "../../context/ChatContext";
import ChatLoadig from "../../components/ChatLoading";
import UserListItem from "../../components/userListItem/UserListItem";
import UserBadgeItem from "../../components/userListItem/UserBadgeItem";
import axios from "axios";

function CreateGroupModel({ children }) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoding] = useState(false);

  const { user, chats, setChats } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
  const handelSubmit = async () => {
    if (!groupName || !members) {
      toast({
        title: "Fill all the required fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };

      const { data } = await axios.post(
        "/api/chat/createGroup",
        {
          name: groupName,
          users: JSON.stringify(members.map((member) => member._id)),
        },
        config
      );
      // console.log(data);
      setChats([data.chat, ...chats]);
      onClose();

      toast({
        title: "New group chat created",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Failed to create group chat",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const addMemberInGroup = (user) => {
    if (members.includes(user)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setMembers([...members, user]);
  };

  const handleDelete = (user) => {
    const res = members.filter((m) => m._id !== user._id);
    setMembers(res);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" d="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Rifat, Arafat"
                mb={3}
                type="text"
                onChange={(e) => handelSearch(e.target.value)}
              />
            </FormControl>

            <Box d="flex">
              {members?.map((member) => (
                <UserBadgeItem
                  user={member}
                  key={member}
                  handleDelete={handleDelete}
                />
              ))}
            </Box>

            {loading ? (
              <Box>
                <span>Loading...</span>
              </Box>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  user={user}
                  key={user._id}
                  handelAccessChat={() => addMemberInGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handelSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateGroupModel;
