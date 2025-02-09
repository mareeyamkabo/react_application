import { useState, } from "react";
import axios from "axios";
import {  Input, FormLabel, Stack, Center,Button, useToast } from "@chakra-ui/react";
import { useParams, useNavigate  } from "react-router-dom"; // Import useParams
// import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "./context/authContext"; // Correct import
const UpdateEbook = () =>{
  const { user } = useAuth(); // Get logged-in user
    const [formData, setFormData] = useState({
        bookname: "",
        authorname: "",
        ISBNnumber: ""
      });
    const {ebookId} = useParams()
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const navigate = useNavigate()
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return (
          <Center>
              <p style={{ color: "red", fontSize: "20px" }}>🚫 You do not have permission to edit this ebook.</p>
          </Center>
      );
  }

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bookname && !formData.authorname && !formData.ISBNnumber) newErrors.bookname = "Fill in at least one field.";
     
        return newErrors;
  };
  const handleChange= (e) =>{
    const{name, value} = e.target
    setFormData({...formData,[name]:value}); //... is showing there are values in form data like destrusturing to make it easy instead of inputing all the values its a summerised way of listing your datas 
    setErrors({...errors,[name]:""}); //clears error for the field bein edited 
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.put(`http://localhost:7070/ebook/${ebookId}`, formData,{
        withCredentials: true, // Ensures cookies (session) are sent
    })// Fetch ebook by ebookId);
      toast({
        title: "Success!",
        description: "Form submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate(`/ebook/${ebookId}`)
  
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong.";
        console.log(errorMessage)
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
          <FormLabel>Bookname</FormLabel>
          <Input
            type="text"
            name="bookname"
            color="black"
            placeholder="Book Name"
            borderWidth="1px"
            variant="subtle"
            value={formData.bookname}
            onChange={handleChange}
        
          />

          <FormLabel>Authorname</FormLabel>
          <Input
            type="text"
            name="authorname"
            color="black"
            placeholder="Author Name"
            borderWidth="1px"
            variant="subtle"
            value={formData.authorname}
            onChange={handleChange}
          />

          <FormLabel>ISBN Number</FormLabel>
          <Input
            type="number"
            name="ISBNnumber"
            color="black"
            placeholder="ISBN"
            borderWidth="1px"
            variant="subtle"
            value={formData.ISBNnumber}
            onChange={handleChange}
          />



          <Button type="submit" colorScheme="green" width="100%">
            Submit
          </Button>
        </Stack>
      </form>
    </Center>
  );
}
export default UpdateEbook;