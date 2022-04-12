import React, { Suspense } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
const Login = React.lazy(() => import("../components/auth/Login"));
const Signup = React.lazy(() => import("../components/auth/Signup"));

function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          w={"100%"}
          bg="var(--primary)"
          m="40px 0 15px 0"
          p="4px"
          borderRadius="lg"
          borderColor="var(--green)"
          borderWidth="1px">
          <Text>Messenger 2.0</Text>
        </Box>
        <Box
          bg="var(--primary)"
          w="100%"
          p={4}
          style={{ marginBottom: 20 }}
          borderRadius="lg"
          borderColor="var(--green)"
          borderWidth="1px">
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab
                color={"white !important"}
                _selected={{ color: "#0e0e12 !important", bg: "#52d794" }}
                width="50%">
                LogIn
              </Tab>
              <Tab
                color={"white !important"}
                _selected={{ color: "#0e0e12 !important", bg: "#52d794" }}
                width="50%">
                Sign-Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Suspense>
  );
}

export default Home;
