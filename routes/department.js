const express = require('express');
const router = express.Router();
const moment = require('moment');
const {
  Department
} = require('../models/department');


router.post('/add', (req, res) => {
    
    const dept1= new Department({
      dname:req.body.dname
    })
dept1.save(function(err){
if(!err){
  res.redirect("/department");
}
else{
  console.log(err);
}
});
  });

  router.get('/',async(req,res)=>{
            res.render('department/index', {
                title: 'Department',
                breadcrumbs: true,
             })
});

  

module.exports=router;