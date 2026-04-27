import { createContext, useContext, useState, useEffect } from 'react';
import Axios from '../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                // Your backend should check the cookie and return user data
                const response = await Axios.get('/user/me');
                if (response.status === 200) {
                    const data = response.data.user;
                    setUser(data); // e.g., { id: 1, name: 'John' }
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 2. The useAuth Hook
export const useAuth = () => useContext(AuthContext);
