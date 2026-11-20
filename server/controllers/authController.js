import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
}

const createToken = (user) => {
    return jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
};



// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (
            typeof full_name !== "string" ||
            !full_name.trim() ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            typeof password !== "string" ||
            password.length < 8 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                message: "Provide a name, valid email and password of 8–72 bytes.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const password_hash = await bcrypt.hash(password, 12);

        const { data: user, error } = await supabase
            .from("users")
            .insert({
                full_name: full_name.trim(),
                email: normalizedEmail,
                password_hash,
                role: "learner",
            })
            .select("id, full_name, email, role")
            .single();

        if (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    message: "An account with this email already exists.",
                });
            }

            throw error;
        }

        res.status(201).json({
            message: "Registration successful",
            user,
            token: createToken(user),
        });
    } catch (error) {
        console.error("Registration failed:", error.message);
        res.status(500).json({
            message: "Registration failed",
        });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const { data: user, error } = await supabase
            .from("users")
            .select("id, full_name, email, password_hash, role")
            .eq("email", email.trim().toLowerCase())
            .maybeSingle();

        if (error) throw error;

        const validPassword = user
            ? await bcrypt.compare(password, user.password_hash)
            : false;

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const { password_hash, ...safeUser } = user;

        res.status(200).json({
            message: "Login successful",
            user: safeUser,
            token: createToken(user),
        });
    } catch (error) {
        console.error("Login failed:", error.message);
        res.status(500).json({
            message: "Login failed",
        });
    }
};