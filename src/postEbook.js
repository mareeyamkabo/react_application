import {
  Center,
  Stack,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { useAuth } from "./context/authContext"; 

function EbookForm() {
    const { user } = useAuth();
  const [formData, setFormData] = useState({
    bookname: "",
    authorname: "",
    ISBNnumber: "",
    numberofstock: "",
  });

  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return (
      <Center>
        <p style={{ color: "red", fontSize: "20px" }}>
          🚫 You do not have permission to edit this ebook.
        </p>
      </Center>
    );
  }
  const validateForm = () => {
    const newErrors = {};
    if (!formData.bookname) newErrors.bookname = "First name is required.";
    if (!formData.authorname) newErrors.authorname = "authorname is required.";
    if (!formData.ISBNnumber) newErrors.ISBNnumber = "I is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); //... is showing there are values in form data like destrusturing to make it easy instead of inputing all the values its a summerised way of listing your datas
    setErrors({ ...errors, [name]: "" }); //clears error for the field bein edited
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post("http://localhost:7070/ebook", formData, {
        withCredentials: true,
      });
      toast({
        title: "Success!",
        description: "Form submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/ebook");
      // setFormData({
      //   bookname: "",
      //   ISBNnumber: "",
      //   email: "",
      //   dob: "",
      //   authorname: "",
      // });
      // setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.status === 409
          ? "IBSN already exists. Please use a different email."
          : error.response?.data?.message || "Something went wrong.";

      console.log(errorMessage);
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
          <FormLabel>Book Name</FormLabel>
          <Input
            type="text"
            name="bookname"
            color="black"
            placeholder="Book Name"
            borderWidth="1px"
            variant="subtle"
            value={formData.bookname}
            onChange={handleChange}
            required
          />

          <FormLabel>Author Name</FormLabel>
          <Input
            type="text"
            name="authorname"
            color="black"
            placeholder="authorname"
            borderWidth="1px"
            variant="subtle"
            value={formData.authorname}
            onChange={handleChange}
            required
          />

          <FormLabel>IBSN</FormLabel>
          <Input
            type="text"
            name="ISBNnumber"
            color="black"
            placeholder="IBSN"
            borderWidth="1px"
            variant="subtle"
            value={formData.ISBNnumber}
            onChange={handleChange}
            required
          />

          <FormLabel>Number of Stock</FormLabel>
          <Input
            type="number"
            name="dob"
            color="black"
            borderWidth="1px"
            variant="subtle"
            value={formData.dob}
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

export default EbookForm;
