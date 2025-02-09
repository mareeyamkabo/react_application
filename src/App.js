import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Center,
  Container,
  Flex,
  List,
  ListItem,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Form from "./form";
import LoginForm from "./login";
import Get from "./fetch";
import Logout from "./logout";
import EbookDetails from "./fetch_id";
import UpdateEbook from "./updateEbook";
import EbookForm from "./postEbook";
import DeleteEbook from './deleteEbook'
import GetAllUsers from "./getAllUser";
import UserDetails from "./getUser";
import { useAuth } from "./context/authContext";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useAuth()

  // Check authentication status on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:7070/auth/status", {
          withCredentials: true, // Include session cookies
        });

        console.log("✅ Auth Status:", response.data);
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("❌ Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <ChakraProvider>
      <Router>
        <div>
          <Center>
            <Container>
              <Center>
                <List>
                  <Flex gap="4">
                    {!isAuthenticated && (
                      <ListItem>
                        <Link to="/form">Signup</Link>
                      </ListItem>
                    )}
                    {!isAuthenticated && (
                      <ListItem>
                        <Link to="/login">Login</Link>
                      </ListItem>
                    )}

                    <ListItem>
                      <Link to="/ebook">Ebooks</Link>
                    </ListItem>

                    {isAuthenticated &&
                      user?.role &&
                      (user.role === "admin" || user.role === "staff") && (
                        <ListItem>
                          <Link to="/postebook">Post an Ebooks</Link>
                        </ListItem>
                      )}

                    {isAuthenticated && (
                      <ListItem>
                        <Link to="/logout">Logout</Link>
                      </ListItem>
                    )}
                  </Flex>
                </List>
              </Center>
            </Container>
          </Center>
        </div>

        <Routes>
          <Route path="/form" element={<Form />} />
          <Route
            path="/login"
            element={<LoginForm setIsAuthenticated={setIsAuthenticated} />}
          />{" "}
          {/* Pass setIsAuthenticated here */}
          <Route
            path="/logout"
            element={<Logout setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/ebook" element={<Get />} />
          <Route path="/ebook/:ebookId" element={<EbookDetails />} />
          <Route path="/updateId/:ebookId" element={<UpdateEbook />} />
          <Route path="/postebook" element={<EbookForm />} />
          <Route path="/delete-book/:ebookId" element={<DeleteEbook />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/user" element={<GetAllUsers />} />
          {/* <Route path="/user/:userId" element={<UserDetails />} /> */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
