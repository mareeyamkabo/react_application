import { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  FormLabel,
  Stack,
  Center,
  Button,
  useToast,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

const UpdateUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const { id } = useParams();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Restrict access to admins only
  if (!user || user.role !== "admin") {
    return (
      <Center>
        <p style={{ color: "red", fontSize: "20px" }}>
          🚫 You do not have permission to update user roles.
        </p>
      </Center>
    );
  }

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`http://localhost:7070/user/${id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setRole(response.data.user.role);
        } else {
          throw new Error("Failed to fetch user role");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast({
          title: "Error",
          description: "Failed to load user role.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [id, toast]);


  const handleChange = (e) => {
    setRole(e.target.value);
    setErrors(""); // Clear error when user makes a change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !["admin", "staff", "user"].includes(role)) {
      setErrors("Invalid role selected.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:7070/update-role/${id}`,
        { role },
        { withCredentials: true }
      );

      toast({
        title: "Success!",
        description: "User role updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate("/users"); // Redirect to users list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast({
        title: "Error!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center>
      <form onSubmit={handleSubmit}>
        <Stack
          spacing="4"
          maxW="400px"
          w="100%"
          mx="auto"
          p="4"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
        >
          <FormLabel>User Role</FormLabel>
          <Select
            name="role"
            value={role}
            onChange={handleChange}
            borderWidth="1px"
            variant="subtle"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </Select>
          {errors && <p style={{ color: "red" }}>{errors}</p>}

          <Button type="submit" colorScheme="green" width="100%">
            Update Role
          </Button>
        </Stack>
      </form>
    </Center>
  );
};

export default UpdateUserRole;
