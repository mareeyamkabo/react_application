import { Center, Stack, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

function Form() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate()


  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required.";
    if (!formData.password) newErrors.password = "password is required.";
    if (!formData.lastname) newErrors.lastname = "Last name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    return newErrors;
  };

  const handleChange = (e)=>{
            const{name, value} = e.target;
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
      await axios.post("http://localhost:7070/auth/register", formData);
      toast({
        title: "Success!",
        description: "Form submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate('/login')
      // setFormData({
      //   firstname: "",
      //   lastname: "",
      //   email: "",
      //   dob: "",
      //   password: "",
      // });
      // setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.status === 409
          ? "Email already exists. Please use a different email."
          : error.response?.data?.message || "Something went wrong.";

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
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstname"
            color="black"
            placeholder="First Name"
            borderWidth="1px"
            variant="subtle"
            value={formData.firstname}
            onChange={handleChange}
            required
          />

          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastname"
            color="black"
            placeholder="Last Name"
            borderWidth="1px"
            variant="subtle"
            value={formData.lastname}
            onChange={handleChange}
            required
          />

          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            color="black"
            placeholder="Email"
            borderWidth="1px"
            variant="subtle"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            name="dob"
            color="black"
            borderWidth="1px"
            variant="subtle"
            value={formData.dob}
            onChange={handleChange}
          />

          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            color="black"
            placeholder="Password"
            borderWidth="1px"
            variant="subtle"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" colorScheme="green" width="100%">
            Submit
          </Button>
        </Stack>
      </form>
    </Center>
  );
}

export default Form;
