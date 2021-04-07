const express = require('express');
const router = express.Router();
const moment = require('moment');
const randomString = require('randomstring');

const {
    Department
} = require('../models/department');

const {
    StudentId,
    Student
} = require('../models/student');

const {
    StudentFee,
    validateFee
} = require('../models/feeManagement');


const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

router.get('/', async (req, res) => {
    /*const dept = await Department.find();

    if (dept) {
        res.render('fee-management/index', {
            title: 'Fee Management',
            breadcrumbs: true,
            search_box: true,
            dept: dept
        });
    }*/
    res.render('fee-management/index', {
        title: 'Fee Management',
        breadcrumbs: true
    })
});

router.get('/pay', async (req, res) => {
    const paymentId = randomString.generate({
        length: 16,
        charset: 'numeric'
    });

    res.render('fee-management/pay', {
        title: 'Pay Fee',
        breadcrumbs: true,
        paymentId: paymentId
    });
});

router.post('/pay', async (req, res) => {
    let errors = [];

    const {
        error
    } = validateFee(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('fee-management/pay', {
            title: 'Pay Fee',
            breadcrumbs: true,
            errors: errors,
            body: req.body
        });
    } else {
        const payment = new StudentFee({
            studentRoll: req.body.studentRoll,
            studentName: req.body.studentName,
            class: req.body.studentClass,
            section: req.body.studentSection,
            department: req.body.studentDept,
            course: req.body.studentCourse,
            amountPaid: req.body.amountPaid,
            amountDue: req.body.amountDue || 0,
            dueDate: req.body.dueDate,
            lateSubmissionFine: req.body.lateFine || 0,
            paymentId: req.body.paymentId
        });

        try {
            const result = await payment.save();

            if (result) {
                req.flash('success_msg', 'Payment Successfull.');
                res.redirect('/fee-management');
            }
        } catch (ex) {
            for (let i in ex.errors) {
                errors.push({
                    text: ex.errors[i].message
                });
            }

            res.render('fee-management/pay', {
                title: 'Pay Fee',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
});

router.get('/list', async (req, res) => {

    StudentFee.find({},(err,found)=>{
        if(!err){
            res.render('fee-management/list', {
                title: 'Reciept list',
                breadcrumbs: true,
                users: found,
                
                
            })

        }
        else{
           console.log(err);
        }
    });
});

router.get('/fullpaid',async(req,res)=>{
    StudentFee.find({amountDue:0},(err,found)=>{
        if(!err){
            res.render('fee-management/list', {
                title: 'Full paid  list',
                breadcrumbs: true,
                users: found,
             })
            }
        else{
            console.log(err);
        }
    })
});

router.get('/duelist',async(req,res)=>{
    StudentFee.find({amountDue:{$gte :100}},(err,found)=>{
        if(!err){
            res.render('fee-management/list', {
                title: 'Full paid  list',
                breadcrumbs: true,
                users: found,
             })
            }
        else{
            console.log(err);
        }
    })
})

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await StudentFee.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('fee-management/list');
    }
});
//update request
// router.get('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
//     const result = await StudentFee.findOne({
//         _id: req.params.id
//     }).select({
//         StudentName: 1,
//         studentRoll: 1,
//         dueDate: 1,
//         amountPaid: 1,
//         amountDue: 1
//     });

//     if (result) {
//         res.send(result);
//     } else {
//         res.status(400).send('Resource not found...');
//     }
// });

module.exports = router;