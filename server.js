import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const server = express();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.info(`Server running in ${PORT} port`));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (password === "asd123" && email === "user@email.com") {
        const payload = {
            email,
            checked: true,
        };
        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1m" });
        return res.json(token);
    }
    return res.status(401).json({
        message: "Login Error",
        reason: "Invalid credentials",
    });
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
        console.info(decodedToken);
        const { email } = decodedToken;
        return res.json({ message: `Welcome again: ${email}` });
    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }
});
