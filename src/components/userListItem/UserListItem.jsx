import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handelAccessChat }) {
  return (
    <Box
      onClick={handelAccessChat}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg">
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.avatar}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
    </Box>
  );
}

export default UserListItem;
