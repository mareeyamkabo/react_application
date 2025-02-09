import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Center, Text, Spinner, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom"; // Import useParams
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "./context/authContext"; // Import useAuth to get user data

const EbookDetails = () => {
  const { ebookId } = useParams(); // Get ebookId from URL
  const [ebookData, setebookData] = useState(null);
  const [loading, setLoading] = useState(true); //if loading is true it will be loading (spinning) if false it will show us our data or display an error message
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const { user } = useAuth(); // Get logged-in user
  

  useEffect(() => { //this function starts whenyou click the route  by mounting this function comes in action
    const fetchebookData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7070/ebook/${ebookId}` ,{
            withCredentials: true, // Ensures cookies (session) are sent
        }// Fetch ebook by ebookId
        );
        setebookData(response.data.data); // Assuming the ebook data is in `data.data`
        setLoading(false);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Something went wrong"
        );
        setLoading(false);
      }
    };

    if (ebookId) {
      fetchebookData();
    }
  }, [ebookId]);//[ebook id ]is present space not left blank because its getting by Id so it depend if the params is updated 

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
        {ebookData.bookname}
      </Text>

      <Box mt="4" p="4" borderWidth="1px" borderRadius="md">
        <Text>
          <strong>Author:</strong> {ebookData.authorname}
        </Text>
        <Text>
          <strong> ISBN:</strong> {ebookData.ISBNnumber}
        </Text>
        <Text>
          <strong>Number:</strong> {ebookData.numberofstock}
        </Text>

        {/* Show Update Ebook button only if user is "admin" or "staff" */}
        {user && (user.role === "admin" || user.role === "staff") && (
          <Button
            colorScheme="teal"
            onClick={() => navigate(`/updateId/${ebookId}`)}
            color="white"
            _hover={{ bg: "teal.600" }}
            textDecoration="underline"
            cursor="pointer"
            variant="solid"
            size="md"
            mt="4"
          >
            Update Ebook
          </Button>
        )}
        {/* Show delete Ebook button only if user is "admin" or "staff" */}
        {user && (user.role === "admin" || user.role === "staff") && (
          <Button
          colorScheme="red"
          onClick={() => navigate(`/delete-book/${ebookId}`)}
          color="white"
          _hover={{ bg: "red.600" }}
          variant="solid"
          size="md"
          mt="4"
        >
          Delete Ebook
        </Button>
        )}
      </Box>
    </Box>
  );
};

export default EbookDetails;
