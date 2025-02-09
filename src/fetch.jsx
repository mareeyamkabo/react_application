import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Button, Center, List, ListItem, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Get = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get("http://localhost:7070/ebook", {
                    withCredentials: true, // Ensures cookies (session) are sent
                });

                console.log("✅ Response Data:", response.data); // Debugging
                setData(Array.isArray(response.data) ? response.data : []);
                console.log("✅ Set Data:", Array.isArray(response.data) ? response.data : []); // Check assigned data

            } catch (error) {
                const errorMessage = error.response
                    ? error.response.data?.message || error.message
                    : error.message;
                setError(errorMessage);
                console.error("❌ Error fetching accounts:", error.response?.data || error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) {
        return (
            <Center>
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) return <p>Error: {error}</p>;

    const handleEbookClick = (ebookId) => {
        navigate(`/ebook/${ebookId}`);
    };
    
    return (
        <Center>
            <div>
                <Center>
                    <Text fontSize="2xl" fontWeight="bold">
                        Ebooks
                    </Text>
                </Center>
                {(data ?? []).length > 0 ? (
                    <List>
                        {data.map((ebook) => (
                            <Box
                                p="4"
                                borderWidth="1px"
                                borderColor="gray.300"
                                key={ebook._id}
                                borderRadius="md"
                                boxShadow="sm"
                                mb="4"
                            >
                                <ListItem>
                                    <h3>Title: {ebook.bookname}</h3>
                                    <p>Author: {ebook.authorname}</p>
                                    <p>ISBN: {ebook.ISBNnumber}</p>
                                    <Button
                                        colorScheme="green"
                                        onClick={() => handleEbookClick(ebook._id)}
                                        color="white"
                                        _hover={{ bg: "green.600" }}
                                        textDecoration="underline"
                                        cursor="pointer"
                                        variant="solid"
                                        size="md"
                                    >
                                        View Account
                                    </Button>
                                </ListItem>
                            </Box>
                        ))}
                    </List>
                ) : (
                    <p>No eBook found</p>
                )}
            </div>
        </Center>
    );
};

export default Get;
