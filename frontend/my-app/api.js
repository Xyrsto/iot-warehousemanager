import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Product } from "./Models/product.js";
import { Category } from "./Models/category.js";
import { User } from "./Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

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

import mqtt from "mqtt";
let topic = "warehouse";
const MQTT_URL = "tcp://6.tcp.eu.ngrok.io:19212";
const options = {
    connectTimeout: 4000,
    username: "xyrsto",
    password: "olamundo",
};

const client = mqtt.connect(MQTT_URL, options);
client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.publish(topic, "finished");
    client.subscribe(topic);
});

client.on("error", (error) => {
    console.error("Error occurred in MQTT connection:", error);
});

let categoryId;
let itemId;

client.on("message", async (topicName, message) => {
    let msg = message.toString();
    if (msg.includes("remove")) {
        itemId = msg.substring(9, msg.length + 1);
        try {
            const products = await Product.aggregate([
                {
                    $addFields: {
                        productIdStr: { $toString: "$productId" },
                    },
                },
                {
                    $match: {
                        productIdStr: { $regex: `^${itemId}` },
                    },
                },
            ]);

            if (products.length == 1) {
                try {
                    categoryId = products[0].categoryId.toString();
                    const category = await Category.findOne({
                        categoryId: categoryId,
                    });

                    if (category.categoryStock > 0) {
                        category.categoryStock -= 1;
                        await category.save();
                    }

                    Product.deleteOne({
                        productId: products[0].productId,
                    }).exec();
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("No products found with the given prefix.");
            }
        } catch (error) {
            console.error("Error finding products:", error);
        }
    } else if (msg.includes("++")) {
        categoryId = msg.substring(0, 8);
        itemId = msg.substring(10, msg.length + 1);

        try {
            const category = await Category.findOne({
                categoryId: categoryId,
            });

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

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    let trimmedToken = "";
    if (token.startsWith("Bearer ")) {
        trimmedToken = token.slice(7, token.length).trimLeft();
    }

    console.log(trimmedToken);
    jwt.verify(trimmedToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            return res.status(401).json({ error: "Invalid token" });
        }
        req.userId = decoded.userId;
        next();
    });
};

app.post("/getInventory", verifyToken, async (req, res) => {
    try {
        let listagem = {};
        const products = await Product.find();

        for (const product of products) {
            const category = await Category.findOne({
                categoryId: product.categoryId,
            });
            listagem[product.productId] =
                category.categoryName + "+" + category.categoryStock;
        }

        res.status(200).json(listagem);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/write", verifyToken, async (req, res) => {
    let rnd = Math.floor(Math.random() * 99999999);

    client.publish(topic, "write+" + rnd);
});

app.post("/delete", verifyToken, async (req, res) => {
    client.publish(topic, "delete");
});

app.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });
        if (existingUser || existingUsername) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, hashedPassword });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.hashedPassword
        );
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const userClaims = {
            userId: user._id,
            username: user.username,
        };

        const token = jwt.sign(userClaims, JWT_SECRET);

        res.status(200).json({ token });
        return user.username;
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
