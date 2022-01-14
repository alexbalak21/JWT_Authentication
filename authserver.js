const express = require("express");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let refreshTokens = [];

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    if (username == null) return res.sendStatus(403);
    const accessToken = gennerateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.sendStatus(204);
});

app.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        const accessToken = gennerateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

function gennerateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}

app.listen(4000, () => console.log("http://localhost:4000/"));
