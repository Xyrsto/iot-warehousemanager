import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Product } from "./Models/product.js"; 

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

const MONGO_URL = process.env.MONGO_URL;
mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database is connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
    });

app.post("/getStock", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
