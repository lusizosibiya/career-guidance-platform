import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMarks } from "../context/MarksContext.jsx"
import { Card, Button } from "../components/UI.jsx"
import { SUBJECTS } from "../data/subjects.js"

const MIN_SUBJECTS = 7;
const LO = "Life Orientation";

const inputClass = "min-h-11 rounded-lg border border-[#D9DFE8] bg-white text-base";

function EnterMarks() {
    const { marks, setMarks } = useMarks();
    const nav = useNavigate();
    const [ rows, setRows ] = useState(marks ?? []);
    const [ subject, setSubject ] = useState("");
    const [ percentage, setPercentage ] = useState("");
    const [ addErr, setAddErr ] = useState("");
    const [ err, setErr ] = useState("");

    const taken = rows.map((r) => r.subject);
    const options = SUBJECTS.filter((s) => !taken.includes(s));

    const addSubject = () => {
        setAddErr("");
        const match = SUBJECTS.find((s) => s.toLowerCase() === subject.trim().toLowerCase());
        const mark = Number(percentage);

        if (!match) return setAddErr("Choose a subject from the list.");
        if (taken.includes(match)) return setAddErr(`${match} is already added.`);
        if (percentage === "" || !Number.isInteger(mark) || mark < 0 || mark > 100)
            return setAddErr("Enter a whole percentage from 0 to 100.");

        setRows([...rows, { subject: match, percentage: mark }]);
        setSubject("");
        setPercentage("");
    };

    // Keep each mark a whole number between 0 and 100
    const updateMark = (s, value) => {
        const mark = value === "" ? "" : Math.min(100, Math.max(0, Math.round(Number(value))));
        setRows(rows.map((r) => (r.subject === s ? { ...r, percentage: mark } : r)));
    };

    const removeSubject = (s) => setRows(rows.filter((r) => r.subject !== s));

    const submit = (e) => {
        e.preventDefault();
        setErr("");
        if (rows.some((r) => r.percentage === "")) return setErr("Fill in a mark for every subject.");
        if (rows.length < MIN_SUBJECTS)
            return setErr(`Add at least ${MIN_SUBJECTS} subjects. You have ${rows.length}.`);
        if (!taken.includes(LO)) return setErr("Life Orientation is required.");
        setMarks(rows);
        nav("/results");
    };

    return(
        <div className="max-w-lg">
            <h1 className="text-2xl font-extrabold">Enter your marks</h1>
            <p className="text-slate-600 mb-4">
                Add every subject you take with your percentage. You need at least {MIN_SUBJECTS}, including Life Orientation.
            </p>

            <Card className="p-4 space-y-3">
                <div className="flex gap-2 items-end">
                    <label className="block flex-1">
                        <span className="block text-sm font-semibold mb-1">Subject</span>
                        <input
                        list="subject-options" value={subject} onChange={(e) => setSubject(e.target.value)}
                        placeholder="Start typing, e.g. Mathematics" className={`w-full px-3 ${inputClass}`} />
                        <datalist id="subject-options">
                            {options.map((s) => <option key={s} value={s} />)}
                        </datalist>
                    </label>
                    <label className="block">
                        <span className="block text-sm font-semibold mb-1">%</span>
                        <input
                        type="number" inputMode="numeric" min="0" max="100" value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubject(); } }}
                        className={`w-20 text-center ${inputClass}`} />
                    </label>
                </div>
                {addErr && <p role="alert" className="text-sm text-red-700">{addErr}</p>}
                <Button type="button" varient="ghost" className="w-full" onClick={addSubject}>+ Add subject</Button>
            </Card>

            <form onSubmit={submit} className="mt-4">
                <Card className="p-4 space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                        <span>Your subjects</span>
                        <span className={rows.length >= MIN_SUBJECTS ? "text-[#1B8A5A]" : "text-slate-500"}>
                            {rows.length} / {MIN_SUBJECTS}
                        </span>
                    </div>
                    {rows.length === 0 && <p className="text-sm text-slate-500">No subjects added yet.</p>}
                    {rows.map((r) => (
                        <div key={r.subject} className="flex items-center gap-2">
                            <span className="flex-1 text-sm">{r.subject}</span>
                            <input
                            type="number" inputMode="numeric" min="0" max="100" value={r.percentage}
                            onChange={(e) => updateMark(r.subject, e.target.value)}
                            aria-label={`${r.subject} percentage`} className={`w-20 text-center ${inputClass}`} />
                            <span className="text-sm text-slate-500">%</span>
                            <button
                            type="button" onClick={() => removeSubject(r.subject)}
                            aria-label={`Remove ${r.subject}`} className="min-h-11 px-2 text-sm font-semibold text-red-700">
                                Remove
                            </button>
                        </div>
                    ))}
                    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
                    <Button varient="accent" className="w-full mt-2">Show my results</Button>
                </Card>
            </form>
        </div>
    );
}

export default EnterMarks;