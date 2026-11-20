import { useState } from "react"
import { Card } from "./UI.jsx"
import { rand } from "../lib/match.js"

// One course. Tap to open or close its careers. tone = "pass" or "near"
function CourseCard({ c, tone, careers }) {
    const [open, setOpen] = useState(false);
    const border = tone === "pass" ? "border-[#1B8A5A]" : "border-[#C77700]";
    const list = careers.filter((x) => c.careerIds.includes(x.id));
    return (
        <Card className={`border-l-4 ${border} p-4`}>
            <button className="w-full text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
                <p className="font-bold">{c.name}</p>
                <p className="text-sm text-slate-600">{c.institution}</p>
                {tone === "near" && (
                    <p className="text-sm text-[#C77700] font-semibold mt-1">
                        {c.gaps.map((g) => `${g.subject}: ${g.short} marks short`).join(". ")}
                        {c.apsShort ? `APS : ${c.apsShort} short.` : ""}
                    </p>
                )}
            </button>
            {open && (
                <div className="mt-3 pt-3 border-t border-[#D9DFE8] text-sm space-y-2">
                    {list.map((k) => (
                        <p key={k.id}>{k.name}: {rand(k.minSalary)} to {rand(k.maxSalary)} per month</p>
                    ))}
                    {tone === "near" && (
                        <p className="text-slate-600">Ways to close the gap: rewrite the subject, a bridging programme, or a TVET college route.</p>
                    )}
                </div>
            )}
        </Card>
    );
}

export default CourseCard;