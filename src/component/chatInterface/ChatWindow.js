import React, { useState, useEffect, useRef } from "react";
import {
  Stack,
  Box,
  Input,
  Button,
  Text,
  Spinner,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { FaSignOutAlt } from "react-icons/fa";

import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { nearByUser } from "../../actions/locationAction";
import { useLocation, useNavigate } from "react-router-dom";
import UsernameDialog from "./UserNameDialog";
import { logout } from "../../actions/userAction";

const socket = io("http://localhost:5000");

function ChatWindow() {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const location = useLocation();

  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [data, setData] = useState([]);
  const [isMapDialogOpen, setMapDialogOpen] = useState(false);

  const { latitude, longitude } = location.state;
  const { loading, nearByUsers } = useSelector((state) => state.nearByLocation);
  const { user } = useSelector((state) => state.user);

  const openMapDialog = () => {
    setMapDialogOpen(true);
  };

  const closeMapDialog = () => {
    setMapDialogOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(nearByUser(latitude, longitude));
      } catch (error) {
        toast({
          title: error,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    fetchData();
  }, [dispatch, latitude, longitude]);

  const uniqueUserIds = new Set(nearByUsers.map((item) => item.user._id));
  const isUserInArray = uniqueUserIds.has(user._id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Setup Socket Events
    const setupEvents = () => {
      socket.on("receive_message", (e) => {
        const data = JSON.parse(e);

        const lastMessage = chatMessages.length
          ? chatMessages[chatMessages.length - 1]
          : null;

        if (
          !(
            lastMessage?.message === data.message &&
            lastMessage?.createdDate === data.createdDate
          )
        ) {
          chatMessages.push(data);
          setChatMessages([...chatMessages]);
        }
      });
    };

    setupEvents();
  }, [chatMessages]);

  // Send Messge
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) {
      toast({
        title: "Enter Message",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  
    const data = { username, message, createdDate: new Date() };
  
    socket.emit("send_message", JSON.stringify(data));
  
    setMessage("");
  
    // Scroll to the bottom of the messages container
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  

  //Map
  const UserLocatedMap = () => {
    const markers = nearByUsers.map((item, index) => {
      const lat = item.location.coordinates[0];
      const long = item.location.coordinates[1];

      return (
        <>
          <Marker key={index} position={[lat, long]}>
            <Popup>
              <h2>Name {item.user.name}</h2>
            </Popup>
          </Marker>
        </>
      );
    });

    return (
      <div>
        <div
          className="flex-grow p-2"
          style={{
            width: "50%",
            height: "50%",
            marginLeft: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers}
          </MapContainer>
        </div>
      </div>
    );
  };

  // Welcome User message
  const welcomeMessageView = () => (
    <Box>
      <Box>
        <HStack
          marginLeft="30%"
          container
          item
          padding={3}
          fontSize="50px"
          textAlign="center"
        >
          <Text item>Welcome {username}</Text>
          <Button onClick={handleLogout}>LogOut</Button>
        </HStack>
        <Button onClick={openMapDialog}>Open Map</Button>
      </Box>

      <Modal isOpen={isMapDialogOpen} onClose={closeMapDialog}>
        <ModalOverlay />
        <ModalContent maxWidth="80%" width="90%" height="95vh">
          <ModalHeader>Map</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UserLocatedMap />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeMapDialog}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );

  // Messages View
  const messagesView = () => (
    <Stack
      ref={scrollRef}
      direction="column"
      spacing={3}
      px={2}
    
      sx={{ flex: 1, overflowY: "auto" }}
    >
      {chatMessages?.map(
        ({ username: otherUsername, message, createdDate }, index) => {
          const self = otherUsername === username;

          return (
            <Box
              key={username + index}
              item
              sx={{
                alignSelf: self ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                maxWidth: "80%",
              }}
            >
              <Text
                fontSize={11}
                sx={{
                  textAlign: self ? "right" : "left",
                }}
                mb={1}
              >
                {otherUsername}
              </Text>
              <Box
                bg={self ? "green.200" : "blue.200"}
                color="black"
                rounded="lg"
                p={3}
                maxW="100%"
                mb={1}
              >
                {message}
              </Box>
              <Text
                fontSize={11}
                sx={{
                  textAlign: self ? "right" : "left",
                }}
              >
                {format(new Date(createdDate), "hh:mm a")}
              </Text>
            </Box>
          );
        }
      )}
    </Stack>
  );

  // Send Message Input
  const controlsView = () => (
    <HStack
      container
      item
      padding={3}
      alignItems="center"
      position="fixed"
      bottom="0"
      width="100%"
      backgroundColor="rgb(17, 17, 9)"
      paddingX={3}
    >
      <Input
        autoFocus
        variant="standard"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={(theme) => ({
          border: "1px solid gray",
          borderRadius: theme.shape.borderRadius,
          paddingLeft: 2,
        })}
        InputProps={{
          disableUnderline: true,
        }}
      />
     <Button colorScheme='teal' onClick={sendMessage} size='lg'>Send</Button>
    </HStack>
  );

  return (
    <div>
      {isUserInArray ? (
        <>
          {welcomeMessageView()}
          <form onSubmit={sendMessage}>
            <Box
              container
              direction="column"
              alignItems="center"
              id="messages-container"
              style={{
                height: "70vh",
                backgroundColor: "#888",
                padding: 5,
                overflowY: "auto",
              }}
            >
              <UsernameDialog username={username} setUsername={setUsername} />

              <Stack
                spacing={1}
                sx={(theme) => ({
                  backgroundColor: "#fff",
                  height: "80vh",
                  width: "40%",
                  borderRadius: theme.shape.borderRadius,
                })}
              >
                {messagesView()}
                {controlsView()}
              </Stack>
            </Box>
          </form>
        </>
      ) : (
        <Spinner size="xl" />
      )}
    </div>
  );
}

export default ChatWindow;
