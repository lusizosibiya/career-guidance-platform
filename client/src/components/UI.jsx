// Reusable Button, Field and Card
export function Button({ varient = "primary", className= "", ...p }) {
    const styles = {
        primary: "bg-[#14213D] text-white hover:bg-[#1f3159]",
        accent: "bg-[#FFC72C] text-[#14213D] hover:brightness-95",
        ghost: "bg-white text-[#14213D] border border-[#D9DFE8] hover:bg-[#F4F6F9]",
        danger: "bg-white text-red-700 border border-red-300 hover:bg-red-50",
    };
    return (
        <button
        {...p}
        className={`min-h-11 px-4 rounded-lg font-semibold text-sm transition ${styles[varient]} ${className}`} />
    );
}

export function Field({ label, hint, className = "", ...p }) {
    return (
        <label className={`block ${className}`}>
            <span className="block text-sm font-semibold mb-1">{label}</span>
            <input { ...p} className="w-full min-h-11 px-3 rounded-lg border border-[#D9DFE8] bg-white text-base" />
            {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
        </label>
    );
}
export function Card({ className= "", ...p }) {
    return <div {...p} className={`bg-white border border-[#D9DFE8] rounded-xl ${className}`} />;
}