import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

// Check whether the user is authenticated
export const authenticateUser = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }

    if (!decoded.userId) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, full_name, email, role")
            .eq("id", decoded.userId)
            .maybeSingle();

        if (error) throw error;

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication lookup failed:", error.message);

        return res.status(500).json({
            message: "Unable to verify user",
        });
    }
};

// Check whether the authenticated user is an admin
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required",
        });
    }

    next();
};

