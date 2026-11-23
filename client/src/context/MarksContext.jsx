import { createContext, useContext, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const MarksContext = createContext(null);
export const useMarks = () => useContext(MarksContext);

// Each learner's marks are saved under their own key so they survive a refresh
const storageKey = (user) => (user ? `pathplug-marks-${user.id}` : null);

function loadMarks(key) {
    if (!key) return null;
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return Array.isArray(saved) ? saved : null;
    } catch {
        return null;
    }
}

// Keeps the learner's marks as [{ subject, percentage }] so all pages can use them
export function MarksProvider({ children }) {
    const { user } = useAuth();
    const key = storageKey(user);
    const [ saved, setSaved ] = useState({ key, marks: loadMarks(key) });

    // when a different learner logs in, read their saved marks instead
    const marks = useMemo(
        () => (saved.key === key ? saved.marks : loadMarks(key)),
        [saved, key]
    );

    const setMarks = (value) => {
        if (key) localStorage.setItem(key, JSON.stringify(value));
        setSaved({ key, marks: value });
    };

    return <MarksContext.Provider value={{ marks, setMarks }}>{children}</MarksContext.Provider>;
}