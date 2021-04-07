const mongoose = require('mongoose');

const attendanceSchema=new mongoose.Schema({
    studentRoll: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    subjectcode: {
        type: String,
        required: true
    },
    subjectname: {
        type: String,
        required: true
    },
    dayspresent: {
        type: Number,
        required: true
    },
    totaldays: {
        type: Number,
        required: true
    },
    attendpercent: {
        type:Number
    }
});
 const Attendance=mongoose.model('Attendance', attendanceSchema);
 exports.Attendance=Attendance;