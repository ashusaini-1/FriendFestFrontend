import React, { useState } from "react";
import { ImLocation } from "react-icons/im";
import { HStack, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { sendLocation } from "../../actions/locationAction";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Input, Button, Center, Flex,InputRightElement ,InputGroup} from "@chakra-ui/react";

const Home = () => {
  const [location, setLocation] = useState("");
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          setLocation("Location not available");
        }
      );
    } else {
      toast({
        title: "Geolocation is not supported by your browser",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  console.log(location);

  const submitLocation = async (e) => {
    e.preventDefault();

    if (!location) {
      toast({
        title: "Location not available",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const [latitude, longitude] = location.split(", ");
    console.log("la"+latitude,"lo"+longitude);

    try {
      const locationData=new FormData();
      locationData.set("latitude",latitude);
      locationData.set("longitude",longitude);
       await dispatch(sendLocation(locationData));
       const props = {
        latitude: latitude,
        longitude: longitude,
      };
      
      navigate("/chat", { state: props });
      // toast({
      //   title: "Location Send",
      //   status: "success",
      //   duration: 3000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    } catch (error) {
      toast({
        title: "Error sending location data",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Box
      bg="GrayText"
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="100vh"
    >
      <Flex className="container" direction="column" alignItems="center">
        <InputGroup className="search-bar" mb={4}>
          <Input
            type="text"
            placeholder="Search"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            readOnly
          />
          <InputRightElement>
            <ImLocation
              className="icon"
              onClick={handleLocationClick}
              style={{ cursor: "pointer" }}
            />
          </InputRightElement>
        </InputGroup>
        <Button onClick={submitLocation}>Search</Button>
      </Flex>
    </Box>
  
  );
};

export default Home;
