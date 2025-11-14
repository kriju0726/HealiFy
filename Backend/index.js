import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ADD THIS ROUTE
app.get("/", (req, res) => {
    res.send("HealiFy Backend is Running Successfully 🚀");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port ${port}`);
});
