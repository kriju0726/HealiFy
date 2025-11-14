import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./config/db.js";

dotenv.config();
const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }))

app.use(express.json());



const port = process.env.PORT;
app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port ${port}`);
});



