import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api.js'

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'pathplug-auth';

// Keeps the user logged in after a page refresh
function loadSavedAuth() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [ auth, setAuth ] = useState(loadSavedAuth); // { user, token } or null
    // On page load, check the saved token is still valid (it expires after 2 hours)
    useEffect(() => {
        const saved = loadSavedAuth();
        if (!saved?.token) return;

        apiRequest('/api/auth/me', { token: saved.token })
            .then(({ user }) => {
                const value = { user: { ...user, name: user.full_name }, token: saved.token };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
                setAuth(value);
            })
            .catch((err) => {
                // only log out if the server rejected the token, not if it was just unreachable
                if (err.status === 401) {
                    localStorage.removeItem(STORAGE_KEY);
                    setAuth(null);
                }
            });
    }, []);

    // Saves the user and token that the login and register endpoints send back
    const saveAuth = ({ user, token }) => {
        const value = { user: { ...user, name: user.full_name }, token };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        setAuth(value);
        return value.user.role;
    };

    const login = async ({ email, password }) => {
        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        return saveAuth(data);
    };

    const signup = async ({ name, email, password }) => {
        const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: { full_name: name, email, password },
        });
        return saveAuth(data);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setAuth(null);
    };

    return(
        <AuthContext.Provider value={{ user: auth?.user ?? null, token: auth?.token ?? null, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}