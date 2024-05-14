import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Product } from "./Models/product.js";
import { Category } from "./Models/category.js";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

const MONGO_URL =
    "mongodb+srv://admin:admin@iot2024.fhrngtw.mongodb.net/?retryWrites=true&w=majority&appName=IoT2024";
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

// MQTT Connection
import mqtt from "mqtt";
let topic = "warehouse";
const MQTT_URL = "mqtt://192.168.189.218";
const options = {
    connectTimeout: 4000,
    username: "ruby",
    password: "aluno23885",
};

const client = mqtt.connect(MQTT_URL, options);
client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(topic);
});

client.on("error", (error) => {
    console.error("Error occurred in MQTT connection:", error);
});

let categoryId;
let itemId;

client.on("message", async (topicName, message) => {
    let msg = message.toString();
    if (msg.includes("++")) {
        categoryId = msg.substring(0, 8);
        itemId = msg.substring(10, msg.length + 1);

        try {
            const category = await Category.findOne({
                categoryId: categoryId,
            });

            console.log(category);

            if (category) {
                category.categoryStock += 1;
                await category.save();
            }

            let product = new Product({
                productId: itemId,
                categoryId: categoryId,
            });
            await product.save();
            client.publish(topic, "finished");
        } catch (error) {
            console.log(error);
        }
    }
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

app.post("/write", async (req, res) => {
    let rnd = Math.floor(Math.random() * 99999999);

    client.publish(topic, "write+" + rnd);
});

app.post("/delete", async (req, res) => {
    client.publish(topic, "delete");
});
