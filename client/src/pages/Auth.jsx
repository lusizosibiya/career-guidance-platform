import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { Button, Field, Card } from "../components/UI.jsx"

export function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const role = await login({ email, password });
            nav(role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return(
        <Card className="max-w-sm mx-auto p-6 mt-4">
            <h1 className="text-2xl font-extrabold mb-4">Log in</h1>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <Button className="w-full">Log in</Button>
            </form>
            <p className="text-sm mt-4">New here? <Link to="/signup" className="font-semibold underline">Sign up</Link></p>
        </Card>
    );
}

export function Signup() {
    const { signup } = useAuth();
    const nav = useNavigate();
    const [name, setName ] = useState("");
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signup({ name, email, password });
            nav("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return(
        <Card className="max-w-sm mx-auto p-6 mt-4">
            <h1 className="text-2xl font-extrabold mb-4">Create your account</h1>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                minLength={8} required hint="At least 8 characters." />
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <Button varient="accent" className="w-full">Sign up</Button>
            </form>
            <p className="text-sm mt-4">Already registered? <Link to="/login" className="font-semibold underline">Log in</Link></p>
        </Card>
    );
}