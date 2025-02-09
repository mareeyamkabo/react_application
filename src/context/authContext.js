import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:7070/auth/user", {
          withCredentials: true,
        });
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("http://localhost:7070/auth/login", credentials, {
        withCredentials: true,

      });
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:7070/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

// ✅ Correctly export both
export { AuthProvider, useAuth };
export default AuthContext;
