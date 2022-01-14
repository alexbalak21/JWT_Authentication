const express = require("express");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
    { username: "Jack", title: "Post 1" },
    { username: "Alice", title: "Post 2" },
    { username: "Alex", title: "Post 3" },
];

app.get("/", authenticateToken, (req, res) => {
    res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    if (user.name == undefined) return res.sendStatus(400);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log("http://localhost:3000/"));
