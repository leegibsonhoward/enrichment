"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mentorshipSchema = new Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mentee: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    programTrack: {
        type: String,
        required: true
    },
    notes: {
        type: Array,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Mentorship", mentorshipSchema);
