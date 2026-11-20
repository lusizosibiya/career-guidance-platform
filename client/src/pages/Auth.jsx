import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { Button, Field, Card } from "../components/UI.jsx"

export function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail ] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        const role = await login({ email });
        nav(role === "admin" ? "/admin" : "/dashboard");
    };

    return(
        <Card className="max-w-sm mx-auto p-6 mt-4">
            <h1 className="text-2xl font-extrabold mb-4">Log in</h1>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                hint="Use an email with 'admin' in it to see the Admin side." />
                <button className="w-full">Log in</button>
            </form>
            <p className="text-sm mt-4">New here? <Link to="/signup" className="font-semibold underline">Sign up</Link></p>
        </Card>
    );
}

export function Signup() {
    const { Signup } = useAuth();
    const nav = useNavigate();
    const [name, setName ] = useState("");
    const [email, setEmail ] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        await Signup({ name, email });
        nav("/dashboard");
    };

    return(
        <Card className="max-w-sm mx-auto p-6 mt-4">
            <h1 className="text-2xl font-extrabold mb-4">Create your account</h1>
            <form onSubmit={submit} className="space-y-4">
                <Field label="First name" value={name} onChange={(e) => setName(e.target.value)} />
                <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button varient="accent" className="w-full">Sign up</Button>
            </form>
            <p className="text-sm mt-4">Already registered? <Link tp="/login" className="font-semibold underline">Log in</Link></p>
        </Card>
    );
}