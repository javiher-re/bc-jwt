import fs from "fs";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";

dotenv.config();

// users
const usersDB = JSON.parse(fs.readFileSync("./users/users.json", "utf8"));

// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

const server = express();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.info(`Server running in ${PORT} port`));

server.use(cors(corsOptions));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = usersDB.find((user) => user.email === email);
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Password is not valid 😝");
        }

        const payload = {
            email,
            checked: true,
        };
        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1m" });
        return res.json(token);
    } catch (error) {
        return res.status(401).json({
            message: error.message ?? "Login Error",
            reason: "Invalid credentials",
        });
    }
});

server.post("/profile", (req, res) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({
                message: "Authorization header is required",
            });
        }
        const token = req.headers.authorization.split(" ").pop();
        const decodedToken = jwt.verify(token, process.env.SECRET);

        return res.json({ user: decodedToken });
    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }
});
