import React, { useState } from "react";
import { Center, Stack, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7070/auth/login", { email, password }, { withCredentials: true });
      toast({
        title: "Success!",
        description: "Logged in successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.log("✅ Login Successful:", response.data);
      setIsAuthenticated(true); // Update the authentication state
      navigate("/ebook"); // Redirect after successful login
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

  return (
    <Center>
      <form onSubmit={handleSubmit}>
        <Stack spacing="4" maxW="400px" w="100%" mx="auto" p="4" borderWidth="1px" borderRadius="md" boxShadow="md">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" colorScheme="blue" width="100%">
            Login
          </Button>
        </Stack>
      </form>
    </Center>
  );
};

export default LoginForm;
