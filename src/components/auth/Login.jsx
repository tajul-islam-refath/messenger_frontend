import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoding] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoding(true);
    if (!email || !password) {
      toast({
        title: "Fill all the required fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoding(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });
      toast({
        title: "User log-in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));
      setLoding(false);
      navigate("/chats");
    } catch (e) {
      console.log(e);
      toast({
        title: "Something error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoding(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired m="8px 0 8px 0">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          value={email}
        />
      </FormControl>

      <FormControl id="password" isRequired m="8px 0 8px 0">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
          />
          <InputRightElement width="4.5rm">
            <Button
              className="chat-btn"
              textColor={"black"}
              onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        onClick={onSubmit}
        className="chat-btn"
        width="100%"
        isLoading={loading}
        style={{ marginTop: 15 }}>
        Log In
      </Button>
      <Button
        className="chat-btn"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("12345678");
        }}>
        Get Guest User
      </Button>
    </VStack>
  );
}

export default Login;
