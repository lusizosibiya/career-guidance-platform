import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMarks } from "../context/MarksContext.jsx"
import { Card, Button } from "../components/UI.jsx"
import { SUBJECTS } from "../data/mock.js"

function EnterMarks() {
    const { marks, setMarks } = useMarks();
    const nav = useNavigate();
    const [ form, setForm ] = useState(marks ?? {});
    const [err, setErr ] = useState("");

    // Keep each mark between 0 and 100
    const set = (s, v) => 
        setForm({ ...form, [s] : v === "" ? "" : Math.min(100, Math.max(0, Number(v))) });
    const filled = Object.values(form).filter((v) => v !== "" && v != null).length;

    const submit = (e) => {
        e.preventDefault();
        if (filled < 3) return setErr("Enter at least 3 subjects.");
        setMarks(form);
        nav("/results")
    };

    return(
        <div className="max-w-lg">
            <h1 className="text-2xl font-extrabold">Enter your marks</h1>
            <p className="text-slate-600 mb-4">Type your percentage (%) for each subject you take. Leave the rest empty.</p>
            <form onSubmit={submit}>
                <Card className="p-4 space-y-3">
                    {SUBJECTS.map((s) => (
                        <label key={s} className="flex items-center justify-between gap-3">
                            <span className="text-sm">{s}</span>
                            <input
                            type="number" inputMode="numeric" min="0" max="100" placeholder="%"
                            value={form[s] ?? ""} onChange={(e) => set(s, e.target.value)}
                            className="w-20 min-h-11 text-center rounded-lg border border-line text-base" />
                        </label>
                    ))}
                    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
                    <Button varient="accent" className="w-full">Show my results</Button>
                </Card>
            </form>
        </div>
    );
}

export default EnterMarks;