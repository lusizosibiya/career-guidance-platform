import { useEffect, useState } from "react";
import { apiRequest } from "./api.js";

// Sends the learner's marks to the server and returns the matching results
export function useMatch(marks) {
    const [result, setResult] = useState({ forMarks: null, data: null, error: "" });

    useEffect(() => {
        if (!marks?.length) return;
        let cancelled = false;

        apiRequest("/api/match", { method: "POST", body: { subjects: marks } })
            .then((data) => {
                if (!cancelled) setResult({ forMarks: marks, data, error: "" });
            })
            .catch((err) => {
                if (!cancelled) setResult({ forMarks: marks, data: null, error: err.message });
            });

        return () => {
            cancelled = true;
        };
    }, [marks]);

    // still loading if the last answer was for older marks
    const loading = Boolean(marks?.length) && result.forMarks !== marks;

    return {
        data: loading ? null : result.data,
        error: loading ? "" : result.error,
        loading,
    };
}