"use strict";

const httpStatus = require("http-status-codes");

module.exports = {
    // route doesn't exist handler
    pageNotFoundError: (req, res) => {
        let errorCode = httpStatus.NOT_FOUND;
        res.status(errorCode);
        res.render("error");
    },
    // internal server errors handler
    internalServerError: (error, req, res, next) => {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.log(`ERROR occurred: ${
            error.stack
        }`);
        res.status(errorCode);
        res.send(`${errorCode} | Sorry, our application is out for lunch!`);
    }
};
