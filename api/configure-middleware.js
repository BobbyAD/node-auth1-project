const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const knex = require("../database/dbConfig.js");

const isProd =
    process.env.NODE_ENV && process.env.NODE_ENV !== "development"
        ? true
        : false;

const sessionExpire = 1000 * 60 * 10;

const sessionConfiguration = {
    name: "test_auth_session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: !isProd,
    resave: false,
    store: new KnexSessionStore({
        knex,
        createtable: true,
        clearInterval: sessionExpire,
        tablename: "sessions",
        sidfieldname: "id",
    }),
    cookie: {
        maxAge: sessionExpire,
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
