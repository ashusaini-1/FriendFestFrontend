import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Input,
  Center,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { loading, user } = useSelector((state) => state.user);

  const registerSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Please Fill all the Details",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      await dispatch(loginUser(formData));

      if (loading) {
      } else if (user) {
        navigate("/");

        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        // The login failed, likely due to incorrect credentials
        toast({
          title: "Invalid email or password",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      toast({
        title: "Error Occurred!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Box
      marginTop="10%"
      mx="auto"
      p={4}
      borderRadius="xl"
      boxShadow="dark-lg"
      backgroundColor="rgb(18, 17, 20)"
      color="white"
      width={{ base: "90%", sm: "70%", md: "50%", lg: "35%" }}
      minHeight="40vh"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        Login
      </Text>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Center>
          <Button
            onClick={registerSubmit}
            marginTop="5%"
            colorScheme="teal"
            variant="outline"
          >
            Login
          </Button>
        </Center>
      </FormControl>
      <Text color="blue.200">
        New our Website!<Link to="/signup"> Join Us</Link>
      </Text>
    </Box>
  );
};

export default Login;
