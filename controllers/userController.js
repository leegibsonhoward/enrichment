"use strict";

const passport = require('passport');
const User = require("../models/user");
const Mentorship = require("../models/mentorship");

const getUserParams = (body) => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      skill: body.skill,
      experience: body.experience,
      programRole: body.programRole,
      programEnrolled: null
    }; 
}

module.exports = {
    index: (req, res, next) => {
        User.find()
        .then(users => {
            // pass users to next middleware
            res.locals.users = users;
            next();
        })
        .catch(error => {
            console.log(`Error fetching users: ${error.message}`);
            next(error);
        });
    },
    indexView: (req, res) => {
        res.render("users/index");
    },
    validate: (req, res, next) => {
        req
        .sanitizeBody("email")
        .normalizeEmail({
            all_lowercase: true
        })
        .trim();
        
        req.check("email", "Email is invalid").isEmail();
      
        req.check("password", "Password cannot be empty")
        .notEmpty();
        
        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = '/users/portal#signup-tab';
                next();
            } else {
                next();
            }
        }); 
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/portal#login-tab",
        failureFlash: "Failed to login.",
        successRedirect: "/dashboard",
        successFlash: "Logged in!"
    }),
    create: (req, res, next) => {
        if (req.skip) next();
        
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (e, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account
                    created successfully!`);
                res.locals.redirect = "/users/portal#login-tab";
                next();
            } else {
                req.flash("error", `Failed to create user account
                    because: ${e.message}.`);
                res.locals.redirect = "/users/portal#signup-tab";
                next();
            }
        });
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
        let userId = req.params.id;

        User.findById(userId)
        .then(user => {
            res.locals.user = user;
            Mentorship.findById(user.programEnrolled)
            .then(mentorship => {
                res.locals.user.mentorship = mentorship
                next();
            })
            .catch(error => {

            });
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        });
    },
    showView: (req, res) => {
        res.render("users/show");
    },
    edit: (req, res, next) => {
        let userId = req.params.id; 
        
        User.findById(userId)
        .then(user => {
            res.render("users/edit", {
                user: user
            });
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        });
    },
    update: (req, res, next) => { 
        let userId = req.params.id,
        
        userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
        };

        User.findByIdAndUpdate(userId, {
            $set: userParams
            // set false, removes deprecation warning 
        }, { useFindAndModify: false })
        .then(user => {
            res.locals.redirect = `/users/${userId}`;
            res.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
            next(error);
        });
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        
        User.findByIdAndRemove(userId, { useFindAndModify: false })
        .then(() => {
            res.locals.redirect = "/users";
            next();
        })
        .catch(error => {
            console.log(`Error deleting user by ID: ${error.message}`);
            next();
        });
    },
    portal: (req, res) => {
        res.render("users/portal", { 
            layout: "layouts/layout_form" 
        });
    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },
    authorize: (roles = []) => {
        if (typeof roles === 'string') {
            roles = [roles];
        }

        return [ (req, res, next) => {

            let loggedIn = res.locals.loggedIn;
            let currentUser = res.locals.currentUser;
            let id = req.params.id;
            
            // check if user is logged in
            if (!loggedIn) {
                // user isn't logged in...
                req.flash("error", 'Not logged in');
                res.redirect("/users/portal#login-tab");
            } else {
                // user is logged in...

                // check if query params exist
                if (id) {
                    // QUERY PARAMS EXIST
                    // user params exists and user is logged in
                    
                    // check if owner or admin 
                    if (id != currentUser.id
                        && currentUser.role != roles[0]) {

                        // user doesn't match and not admin
                        req.flash("error", "Cant access other accounts");
                        res.redirect("/dashboard");
                    } else {
                        // id does match or role is admin
                        
                        // check if user role exists in roles object
                        if (roles.length && roles.includes(currentUser.role)) {
                            // role exists
                            next();
                        } else {
                            // role doesn't exist
                            req.flash("error", "Role not found");
                            res.redirect("/users/portal#login-tab");
                        }
                    }
                } else {
                    // QUERY PARAMS DON'T EXIST
                    // user params doesn't exist and user is logged in

                    // check if admin
                    if (currentUser.role != roles[0]) {
                        req.flash("error", "No access");
                        res.redirect("/dashboard");
                    } else {
                        if (roles.length && roles.includes(currentUser.role)) {
                            // user role is allowed
                            next();
                        } else {
                            // user role isn't allowed
                            req.flash("error", "User not allowed");
                            res.redirect("/dashboard");
                        }
                    }
                }
            }
        }];
    }
};