"use strict";

const Mentorship = require("../models/mentorship");
const User = require("../models/user");

module.exports = {
    index: (req, res, next) => {
        Mentorship.find()
        .then(mentorships => {
            // pass users to next middleware
            res.locals.mentorships = mentorships;
            next();
        })
        .catch(error => {
            console.log(`Error fetching users: ${error.message}`);
            next(error);
        });
    },
    indexView: (req, res) => {
        res.render("mentorships/index");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        
        if (redirectPath) {
            res.redirect(redirectPath);
        } else {
            next();
        }
    },
    show: (req, res, next) => {
        let mentorshipId = req.params.id;
        // step 1:
        Mentorship.findById(mentorshipId)
        .then(mentorship => {
            // pass mentorship
            res.locals.mentorship = mentorship;
            // step 2:
            User.findById(mentorship.mentor)
            .then(mentor => {
                // pass mentor
                res.locals.mentorship.mentor = mentor;
                // step 3:
                User.findById(mentorship.mentee)
                .then(mentee => {
                    // pass mentee
                    res.locals.mentorship.mentee = mentee;
                    // end of chain, next middleware, which is (showView)
                    next();
                })
                .catch(error => {
                    console.log(`Error fetching mentee by ID: ${error.message}`);
                    next(error);
                });
            })
            .catch(error => {
                console.log(`Error fetching mentor by ID: ${error.message}`);
                next(error);
            });
        })
        .catch(error => {
            console.log(`Error fetching mentorship by ID: ${error.message}`);
            next(error);
        });
    },
    showView: (req, res) => {
        res.render("mentorships/show");
    },
    // edit
    // update
    // delete
};