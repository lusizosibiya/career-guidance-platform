import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import courseRoutes from "./routes/courseRoutes.js";
import { supabase } from "./config/supabase.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Course Matcher API is running!" });
});

app.use("/api/courses", courseRoutes);

app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from("institutions").select("id, name");

    if (error) {
      throw error;
    }

    res.status(200).json({ message: "Supabase connection successful!", institutions: data });
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    res.status(500).json({ message: "Error connecting to Supabase", error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});