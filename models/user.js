"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    skill: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true
    },
    programRole: {
        type: String,
        required: true
    },
    programEnrolled: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentorship',
        required: false
    },
    role: { type: String, default: 'User', enum: ['User', 'Admin'] },
}, { timestamps: true });

// virtual method joins first and last name
userSchema.virtual("fullName")
    .get(function() {
        return `${this.name.first} ${this.name.last}`;
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
  });

module.exports = mongoose.model("User", userSchema);
