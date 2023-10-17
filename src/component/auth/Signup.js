import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Input,
  Center,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../actions/userAction";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const registerSubmit = async (e) => {
    e.preventDefault();

    const numericValue = contact.replace(/\D/g, "");
    if (!name || !email || !contact || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Details",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password not Match",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else if (numericValue.length !== 10) {
      toast({
        title: "Enter a valid Number",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("contact", contact);
      formData.set("password", password);
      formData.forEach((item) => {
        console.log(item);
      });

      await dispatch(registerUser(formData));
      navigate("/login");
    } catch (error) {
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
      marginTop="3%"
      mx="auto"
      p={4}
      minHeight="40vh"
      borderRadius="xl"
      boxShadow="dark-lg"
      backgroundColor="rgb(18, 17, 20)"
      color="white"
      width={{ base: "90%", sm: "70%", md: "50%", lg: "35%" }}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        Signup
      </Text>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel>Number</FormLabel>
        <Input
          type="number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Center>
          <Button
            onClick={registerSubmit}
            marginTop="5%"
            colorScheme="teal"
            variant="outline"
          >
            Signup
          </Button>
        </Center>
      </FormControl>
      <Text color="blue.200">
        All Ready have account!<Link to="/login"> Click here</Link>
      </Text>
    </Box>
  );
};

export default Signup;
