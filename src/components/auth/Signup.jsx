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
import Toast from "../../utils/Toast";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoding] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const fileUpload = async (pic) => {
    setLoding(true);
    if (pic == undefined) {
      toast({
        title: "Account created.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "messenger");
      data.append("cloud_name", "rifat");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/rifat/image/upload",
          data
        );
        console.log(res.data);
        setImage(res.data.secure_url);
        setLoding(false);
      } catch (e) {
        toast({
          title: "Image upload failed",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setLoding(false);
      }
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoding(true);
    if (!name || !password || !passwordConfirm) {
      toast({
        title: "Fill all the required fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoding(false);
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: "Password not matched",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoding(false);
      return;
    }

    try {
      const user = {
        name,
        email,
        password,
        image,
      };
      const { data } = await axios.post("/api/user/register", user);
      toast({
        title: "User created successfully",
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
      <FormControl id="name" isRequired m="8px 0 8px 0">
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </FormControl>
      <FormControl id="email" isRequired m="8px 0 8px 0">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </FormControl>

      {/* <FormControl id="text" isRequired m="8px 0 8px 0">
        <FormLabel>Phone Number</FormLabel>
        <Input
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          placeholder="Enter your phone number"
        />
      </FormControl> */}

      <FormControl id="password" isRequired m="8px 0 8px 0">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
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

      <FormControl id="confirmPassword" isRequired m="8px 0 8px 0">
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Confirm password"
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

      <FormControl id="image" isRequired m="8px 0 8px 0">
        <FormLabel>Profile Image</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Select a photo"
          onChange={(e) => fileUpload(e.target.files[0])}
        />
      </FormControl>

      <Button
        onClick={onSubmit}
        className="chat-btn"
        width="100%"
        isLoading={loading}
        style={{ marginTop: 15 }}>
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
