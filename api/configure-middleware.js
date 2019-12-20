const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const isProd =
    process.env.NODE_ENV && process.env.NODE_ENV !== "development"
        ? true
        : false;

const sessionConfiguration = {
    name: "test_auth_session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: !isProd,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: isProd,
        httpOnly: true
    }
};

module.exports = server => {
    server.use(helmet());
    server.use(express.json());
    server.use(cors());
    server.use(session(sessionConfiguration));
};
