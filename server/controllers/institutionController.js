import { supabase } from "../config/supabase.js";

const allowedFields = [
    "name",
    "type",
    "location",
    "website",
    "aps_rules",
];

function pickAllowedFields(body) {
    return Object.fromEntries(
        allowedFields
            .filter((field) =>
                Object.prototype.hasOwnProperty.call(body, field)
            )
            .map((field) => [field, body[field]])
    );
}

function validInstitution(input) {
    return (
        typeof input.name === "string" &&
        input.name.trim().length > 0 &&
        ["university", "tvet"].includes(input.type) &&
        (input.location == null || typeof input.location === "string") &&
        (input.website == null || typeof input.website === "string") &&
        input.aps_rules !== null &&
        typeof input.aps_rules === "object" &&
        !Array.isArray(input.aps_rules)
    );
}

// GET /api/institutions
export const getInstitutions = async (req, res) => {
    const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .order("name");

    if (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to fetch institutions" });
    }

    res.json(data);
};

// POST /api/institutions
export const createInstitution = async (req, res) => {
    const input = pickAllowedFields(req.body ?? {});

    if (!validInstitution(input)) {
        return res.status(400).json({ message: "Invalid institution data" });
    }

    const { data, error } = await supabase
        .from("institutions")
        .insert(input)
        .select()
        .single();

    if (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to create institution" });
    }

    res.status(201).json(data);
};

// PUT /api/institutions/:id
export const updateInstitution = async (req, res) => {
    const input = pickAllowedFields(req.body ?? {});

    if (!validInstitution(input)) {
        return res.status(400).json({ message: "Invalid institution data" });
    }

    const { data, error } = await supabase
        .from("institutions")
        .update(input)
        .eq("id", req.params.id)
        .select()
        .maybeSingle();

    if (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to update institution" });
    }

    if (!data) {
        return res.status(404).json({ message: "Institution not found" });
    }

    res.json(data);
};

// DELETE /api/institutions/:id
export const deleteInstitution = async (req, res) => {
    const { data, error } = await supabase
        .from("institutions")
        .delete()
        .eq("id", req.params.id)
        .select("id")
        .maybeSingle();

    if (error?.code === "23503") {
        return res.status(409).json({
            message: "Cannot delete an institution with linked courses",
        });
    }

    if (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to delete institution" });
    }

    if (!data) {
        return res.status(404).json({ message: "Institution not found" });
    }

    res.status(204).send();
};