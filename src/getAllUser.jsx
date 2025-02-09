import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Button, Center, List, ListItem, position, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
const { user } = useAuth();

const GetAllUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== "admin") {
          setError("Access denied. Admins only.");
          setLoading(false);
          return;
        }   
        const fetchUsers = async () => {
          try {
            const response = await axios.get("http://localhost:7070/users", {
              withCredentials: true, // Ensures authentication session is sent
            });

            console.log("✅ Response Data:", response.data); // Debugging
            setUsers(
              Array.isArray(response.data.users) ? response.data.users : []
            );
          } catch (error) {
              const errorMessage = error.response
                ? error.response.data?.message || error.message
                : error.message;
            console.error("Error fetching users:", errorMessage);
            toast({
              title: "Error",
              description: errorMessage ,
              status: "error",
              duration: 3000,
                isClosable: true,
              position: top
            });
          } finally {
            setLoading(false);
          }
        };
        fetchUsers();
    }, []);
    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      try {
        await axios.delete(`http://localhost:7070/user/${id}`, {
          withCredentials: true,
        });
        setUsers(users.filter((user) => user._id !== id)); // Remove user from list
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete user");
      }
    };

    if (loading) {
        return (
            <Center>    
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) return <p>Error: {error}</p>;

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
      <Center>
        <div>
          <Center>
            <Text fontSize="2xl" fontWeight="bold">
              Users
            </Text>
          </Center>
          {(users ?? []).length > 0 ? (
            <List>
              {users.map((user) => (
                <Box
                  p="4"
                  borderWidth="1px"
                  borderColor="gray.300"
                  key={user._id}
                  borderRadius="md"
                  boxShadow="sm"
                  mb="4"
                >
                  <ListItem>
                    <h3>
                      Name: {user.firstname} {user.lastname}
                    </h3>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <Button
                      colorScheme="green"
                      onClick={() => handleUserClick(user._id)}
                      color="white"
                      _hover={{ bg: "green.600" }}
                      textDecoration="underline"
                      cursor="pointer"
                      variant="solid"
                      size="md"
                    >
                      View User
                    </Button>
                    {/* Show delete button only if logged-in user is admin */}
                    {user && user.role === "admin" && (
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(user._id)}
                        color="white"
                        _hover={{ bg: "red.600" }}
                        variant="solid"
                        size="md"
                        ml="2"
                      >
                        Delete User
                      </Button>
                    )}
                  </ListItem>
                </Box>
              ))}
            </List>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </Center>
    );
};

export default GetAllUsers;
