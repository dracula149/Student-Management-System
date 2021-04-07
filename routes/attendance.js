const express = require('express');
const router = express.Router();
const {
    Attendance
}=require('../models/attendance');

const {Student} =require('../models/student')

const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

router.get('/',[ensureAuthenticated],async(req,res)=>{
    res.render('attendance/index',{
        title: 'Attendance management',
        breadcrumbs: true 
    })
});

router.get('/add',[ensureAuthenticated],async(req,res)=>{
    res.render('attendance/add',{
        title: 'add attendance',
        breadcrumbs: true,
    })
});

router.post('/add',[ensureAuthenticated],async(req,res)=>{
    const dp=req.body.dayspresent;
    const tot=req.body.totaldays;
    const percent=Math.floor((dp/tot)*100);

    const attend=new Attendance({
        studentRoll:req.body.rollno,
        studentName:req.body.studentname,
        subjectcode:req.body.subjectcode,
        subjectname:req.body.subjectname,
        dayspresent:req.body.dayspresent,
        totaldays:req.body.totaldays,
        attendpercent:percent

    });
    attend.save(function(err){
        if(!err){
            res.redirect('/attendance');
        }
        else{
            console.log(err);
        }
    })

});

router.get('/shortagelist',async(req,res)=>{
    Attendance.find({attendpercent: {$lt: 75}},(err,found)=>{
        if(!err){
            res.render('attendance/list', {
                title: 'Attendance Shortage list',
                breadcrumbs: true,
                attendance: found,
                
                
            })

        }
        else{
           console.log(err);
        }
    });
});

router.get('/list',async(req,res)=>{
    Attendance.find({},(err,found)=>{
        if(!err){
            res.render('attendance/list', {
                title: 'Attendance list',
                breadcrumbs: true,
                attendance: found,
                
                
            })

        }
        else{
           console.log(err);
        }
    });
});

router.get('/noshortagelist',async(req,res)=>{
    Attendance.find({attendpercent: {$gte: 75}},(err,found)=>{
        if(!err){
            res.render('attendance/list', {
                title: 'Attendance Shortage list',
                breadcrumbs: true,
                attendance: found,
                
                
            })

        }
        else{
           console.log(err);
        }
    });
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await Attendance.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('attendance/list');
    }
});

module.exports=router;