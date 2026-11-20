import { createContext, useContext, useState } from 'react'

const MarksContext = createContext(null);
export const useMarks = () => useContext(MarksContext);

// Keeps the learner's marks so all pages can use them
export function MarksProvider({ children }) {
    const [marks, setMarks ] = useState(null);
    return <MarksContext.Provider value={{ marks, setMarks}}>{children}</MarksContext.Provider>;
}