import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Course Matcher API is running!" });
});

app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});