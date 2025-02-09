import { useState } from "react";
import { Center, Button, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.get("http://localhost:7070/auth/logout", { withCredentials: true });
      setIsAuthenticated(false); // Update the authentication state
      toast({
        title: "Logged out successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/"); // Redirect after logout
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <Center flexDirection="column" mt="10">
      <Text fontSize="xl" mb="4">Are you sure you want to logout?</Text>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Button colorScheme="red" onClick={handleLogout} size="lg">
          Logout
        </Button>
      )}
    </Center>
  );
};


export default Logout;
