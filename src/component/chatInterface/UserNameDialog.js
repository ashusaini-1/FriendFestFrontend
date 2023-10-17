import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

function UsernameDialog({ username, setUsername }) {
  const [user, setUser] = useState("");

  return (
    <Modal isOpen={!username} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please enter your username</ModalHeader>
        <ModalBody>
          <Input
            autoFocus
            variant="filled"
            fullWidth
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setUsername(user)}>Enter Chat Room</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UsernameDialog;
