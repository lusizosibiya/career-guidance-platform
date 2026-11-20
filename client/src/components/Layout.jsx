import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { Button } from "./UI.jsx"

const LEARNER_LINKS =[
    { to: "/dashboard", label: "Dashboard"},
    { to: "/marks", label: "Enter marks"},
    { to: "/results", label: "My results"},
]; 
const ADMIN_LINKS = [
    { to: "/admin/courses", label: "Courses"},
    { to: "/admin/careers", label: "Careers"},
];

function Brand() {
    return (
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-6 h-6 rounded bg-signal inline-block" aria-hidden />
            pathPlug
        </Link>
    );
}

// Frame for landing, Login, Signup
export function PublicLayout() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-[#14213D] text-white">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Brand />
                    {user ? (
                       <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-sm font-semibold bg-[#FFC72C] text-[#14213D] px-3 py-2 rounded-lg">
                        Go to dashboard
                       </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-semibold px-3 py-2">Log in</Link>
                            <Link to="/signup" className="text-sm font-semibold bg-[#FFC72C] text-[#14213D] px-3 py-2 rounded-lg">Sign up</Link>
                            </div>
                    )}
                </div>
            </header>
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6"><Outlet /></main>
            <footer className="text-xs text-slate-500 text-center py-6 px-4">
                pathPlug helps you compare options. Always confirm requirements with the institution.
            </footer>
        </div>
    );
}

// Frame for logged-in pages: sidebar on laptops, bottom menu on phones
export function AppLayout() {
    const { user, logout } = useAuth();
    const nav = useNavigate();
    const links = user.role === "admin" ? ADMIN_LINKS : LEARNER_LINKS;

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-[#14213D] text-white">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Brand />
                    <div className="flex items-center gap-3 text-sm">
                        <span className="hidden sm:inline">{user.name} ({user.role === "admin" ? "Admin" : "Learner"})</span>
                        <Button variant="ghost" onClick={() => { logout(); nav("/"); }}>Log out</Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex max-w-6xl w-full mx-auto">
                {/* Sidebar: hidden on phones, shown from md (768px) up */}
                <aside className="hidden md:block w-56 shrink-0 p-4 border-r border-[#D9DFE8]">
                    <nav className="space-y-1" aria-label="Main">
                        {links.map((l) => (
                            <NavLink key={l.to} to={l.to}
                            className={({ isActive }) => `flex items-center min-h-11 px-3 rounded-lg font-semibold text-sm ${isActive ? "bg-[#14213D] text-white" : "hover:bg-white"}`}>
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 min-w-0 px-4 py-6 pb-6"><Outlet /></main>
            </div>

            {/* Bottom menu: shown on phones, hidden from md up */}
            <nav className="md:hidden fixed bottom-0 insert-x-0 bg-[#14213D] text-white flex z-20" aria-label="Main">
                {links.map((l) => (
                    <NavLink key={l.to} to={l.to}
                    className={({ isActive }) => `flex-1 text-center py-4 text-sm font-semibold ${isActive ? "text-[#FFC72C]" : ""}`}>
                        {l.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}