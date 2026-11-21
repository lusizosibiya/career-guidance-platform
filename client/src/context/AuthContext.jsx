import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// MOCK login for now. An email containing 'admin' becomes an Admin.
// Backend teammate: replace these with real calls to the Express API.
export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);

    const login = async ({ email }) => {
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'learner';
        setUser({ name: email.split('@')[0], email, role });
        return role;
    };
    const signup = async ({ name, email}) => {
        setUser({ name, email, role: 'learner' });
        return 'learner';
    };
    const logout = () => setUser(null);

    return(
        <AuthContext.Provider value={{ user, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
}