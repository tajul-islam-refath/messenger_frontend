import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React from "react";

function UserBadgeItem({ user, handleDelete }) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      color="white"
      bg="purple"
      cursor="pointer"
      onClick={() => handleDelete(user)}>
      {user.name}
      <CloseIcon ml={4} />
    </Box>
  );
}

export default UserBadgeItem;
