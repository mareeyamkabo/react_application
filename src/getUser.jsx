import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Center, Text, Spinner, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext"; // Ensure this is inside a function

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Moved inside function
  const toast = useToast(); // ✅ Initialized toast properly

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:7070/users", {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data?.message || error.message
          : error.message;
        console.error("Error fetching users:", errorMessage);

        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, toast]); // ✅ Included `toast` in dependency array

  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box maxW="700px" w="100%" mx="auto" p="4">
      <Text fontSize="2xl" fontWeight="bold">
        All Users
      </Text>

      {users.length === 0 ? (
        <Text>No users found.</Text>
      ) : (
        users.map((user) => (
          <Box key={user._id} mt="4" p="4" borderWidth="1px" borderRadius="md">
            <Text>
              <strong>Email:</strong> {user.email}
            </Text>
            <Text>
              <strong>Role:</strong> {user.role}
            </Text>

            <Button
              colorScheme="teal"
              onClick={() => navigate(`/update-user/${user._id}`)}
              mt="4"
            >
              Update
            </Button>

            <Button
              colorScheme="red"
              onClick={() => navigate(`/delete-user/${user._id}`)}
              mt="4"
              ml="2"
            >
              Delete
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default GetAllUsers;
