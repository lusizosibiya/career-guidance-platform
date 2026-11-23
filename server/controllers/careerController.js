import { supabase } from "../config/supabase.js";

// GET /api/careers
export const getCareers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("careers")
            .select("*")
            .order("name");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error("Get careers failed:", error.message);
        res.status(500).json({
            message: "Failed to fetch careers",
        });
    }
};

// POST /api/careers
export const createCareer = async (req, res) => {
    try {
        const { name, description } = req.body ?? {};

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof description !== "string" ||
            !description.trim()
        ) {
            return res.status(400).json({
                message: "Career name and description are required",
            });
        }

        const { data, error } = await supabase
            .from("careers")
            .insert({
                name: name.trim(),
                description: description.trim(),
            })
            .select()
            .single();

        if (error?.code === "23505") {
            return res.status(409).json({
                message: "Career already exists",
            });
        }

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error("Create career failed:", error.message);
        res.status(500).json({
            message: "Failed to create career",
        });
    }
};
