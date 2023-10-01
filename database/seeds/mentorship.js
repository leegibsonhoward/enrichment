"use strict"

// Seed Mentorships

// 1. create a mentorship
// 2. update users with mentorship id

const Mentorship = require('../../models/mentorship');
const User = require('../../models/user');

const mongoose = require('mongoose');

mongoose.connect(
    "mongodb://localhost:27017/mentorship_db",
    { useNewUrlParser: true }
  );

Mentorship.create({
  mentor: mongoose.Types.ObjectId('5de959731528360b98383074'),
  mentee: mongoose.Types.ObjectId('5ddcb4d80c28ab04def51a17'),
  programTrack: "web",
  notes: ["Another web development mentorship program test!"],
})
.then(mentorship => {
  User.findOneAndUpdate({ _id: mentorship.mentor},{ programEnrolled: mentorship._id}, {new: true})
  .then(mentor => {
    console.log(mentor);
    User.findOneAndUpdate({ _id: mentorship.mentee},{ programEnrolled: mentorship._id}, {new: true})
    .then(mentee => {
      console.log(mentee);
    })
    .catch(error => {
      console.log(error.message);
    });
  })
  .catch(error => {
    console.log(error.message);
  });
})
.catch(error => {
  console.log(error.message)
});