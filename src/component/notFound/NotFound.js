import React from 'react';
import { Box, Center, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Center h="100vh">
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" color="red.500">
          404
        </Text>
        <Text fontSize="xl">Page Not Found</Text>
        <Text fontSize="md" color="gray.500">
          The requested page does not exist.
        </Text>
        <Button as={Link} to="/" colorScheme="teal" mt={4}>
          Go Home
        </Button>
      </Box>
    </Center>
  );
};

export default NotFound;
