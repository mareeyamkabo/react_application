import React, { useEffect } from "react";
import axios from "axios";
import { Center, Text, Spinner, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./context/authContext";

const DeleteEbook = () => {
  const { user } = useAuth();
  const { ebookId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteEbook = async () => {
      console.log("Attempting to delete ebook with ID:", ebookId);

      if (!user || user.role !== "admin") {
        toast({
          title: "Unauthorized",
          description: "You do not have permission to delete this ebook.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        navigate(`/ebook`);
        return;
      }

      try {
        const response = await axios.delete(`http://localhost:7070/ebook/${ebookId}`, { withCredentials: true });

        if (response.data.successful) {
          toast({
            title: "Success!",
            description: "Ebook deleted successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          navigate(`/ebook`);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        toast({
          title: "Error!",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        navigate(`/ebook`);
      }
    };

    if (ebookId) {
      deleteEbook();
    }
  }, [ebookId, user, navigate, toast]);

  return (
    <Center flexDirection="column" mt="10">
      <Text fontSize="xl" mb="4">
        Deleting ebook...
      </Text>
      <Spinner size="lg" />
    </Center>
  );
};

export default DeleteEbook;
