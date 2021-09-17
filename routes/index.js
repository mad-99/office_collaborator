var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
var Employ=require('../models/Employee');
var Admin=require('../models/Admin');
mongoose.connect("mongodb+srv://admin:Maheshwari%401002@kietproject.0xeag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>console.log("Conencted")).catch(err=>console.log(err));

/* GET home page. */
router.get('/', function(req, res) {
  if(!req.session.auth_user)
  {
  res.render('home', { title: 'Express',req:req });

  }
  else
  {
    res.redirect('/update/profile')
  }
});



router.get('/add/employ', function(req, res) {
 
  if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  res.render('index', { title: 'Express' });
  }

});


router.get('/list/employ',function(req,res){
    if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  Employ.find({}).then(employs=>{
    res.render('employ',{employs})
  })
}
  

})

router.post('/api/add/employ',function(req,res){
    if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  console.log("data inside body is ",req.body)
  var {name,email,password,designation,band,reporting_manager,allocated_project}= req.body;

  Employ.findOne({email}).then(employ=>{
    if(employ)
    {
 

return res.json({success:1,message:"Employ already exists with this email id"})
    }
    else
    {
      var employ = new Employ({
    name,
    email,
    password,
    designation,
    band,
    allocated_project,
    reporting_manager,
    role:"employ"
  })

  employ.save().then(()=>{
    return res.json({success:1,message:"Employ added successfully"})
  }).catch(err=>{
    return res.json({success:1,message:"Error in adddinh employ"})
  })
    }
  })
}

})


router.post('/api/update/employ',function(req,res){
    if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  var {name,email,phone,skills} = req.body

  Employ.findOne({email}).then(employ=>{
    if(employ)
    {
      employ.name=name
      employ.email = email
      employ.phone=phone
      employ.skills=skills

       employ.save().then(()=>{
   return res.json({success:1,message:"Employ updated successfully"})
  }).catch(err=>{
   return res.json({success:1,message:"Error in updating employ"})
  })
    }
    else
    {
     return res.json({success:0,message:"unable to find the employ details"})
    }
  })
}
})


router.post("/api/delete/employ",function(req,res){
    if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  var {email} = req.body
  Employ.deleteOne({email}).then((err,result)=>{
    console.log("error is============================= ",err.deletedCount)
    if(err.deletedCount !== 1)
    {

     return res.json({success:0,message:"Error in deleting employ"})
    }
    else
    {
       Employ.find({}).then(data=>{
        
     return res.json({success:1,message:"Employ deleted successfully",employs:data})
      })
    }
  })
}
})

router.get('/update/profile',function(req,res){
 
  if(req.session.auth_user) 
  {
     console.log("auht usre is",req.session.auth_user.email)
    Employ.findOne({email:req.session.auth_user.email}).then(user=>{
       res.render("update",{resp:{data:{data:user}},req})
    })

  }
  else
  {
    res.redirect("/")
  }

 
})


router.get('/set',function(req,res){
  req.session.test="some string"
  res.send("session set")
})
router.get('/get',function(req,res){
  console.log("inside get funtion======================")
  res.send(req.session.test)
})


router.post('/api/employ/login',function(req,res){
  var {email,password,role} =req.body
  Employ.findOne({email:email.trim(),password:password.trim(),role:role.trim()},{password:0}).then(employ=>{
    if(employ)
    {
      req.session.auth_user=employ
      res.json({success:1,message:"User logged in successfully"})
    }  
    else
    {
      res.json({success:0,message:"Error occured at the time of login"})

    }
  })

})

router.get("/api/user/logout",function(req,res){
delete req.session.auth_user;
      res.json({success:1,message:"User logged out successfully"})
})


router.post('/api/update/user',function(req,res){
  var {name,skills,password,phone,address}= req.body
  if(req.session.auth_user && req.session.auth_user.email)
  {

   Employ.findOne({email,name}).then(employ=>{
    if(employ)
    {
      employ.name=name
      employ.email = email
      employ.phone=phone
      employ.skills=skills
      employ.address=address


       employ.save().then(()=>{
   return res.json({success:1,message:"Employ updated successfully"})
  }).catch(err=>{
   return res.json({success:1,message:"Error in updating employ"})
  })
    }
    else
    {
     return res.json({success:0,message:"unable to find the employ details"})
    }
  })
  }
  else
  {
    res.json({success:0,message:"You are not authorized to view this page"})
  }
 

})

router.get('/api/search/:id',function(req,res){
    Employ.findOne({_id:req.params.id.trim()}).then(employ=>{
    if(employ)
    {
      res.json({success:1,data:employ})
    }
    else
      {{
        res.json({success:0,data:[]})
      }}
  })
})


router.get('/api/serach/:name',function(req,res){
  Employ.find({name:req.params.name.trim()}).then(employ=>{
    if(employ)
    {
      res.json({success:1,data:employ})
    }
    else
      {{
        res.json({success:0,data:[]})
      }}
  })
})

router.get('/api/serach/:project',function(req,res){
  Employ.find({allocated_project:req.params.project.trim()}).then(employ=>{
    if(employ)
    {
      res.json({success:1,data:employ})
    }
    else
      {{
        res.json({success:0,data:[]})
      }}
  })
})

router.get('/api/serach/:location',function(req,res){
  Employ.find({address:req.params.location.trim()}).then(employ=>{
    if(employ)
    {
      res.json({success:1,data:employ})
    }
    else
      {{
        res.json({success:0,data:[]})
      }}
  })
})

router.get('/api/serach/:designation',function(req,res){
  Employ.find({designation:req.params.designation.trim()}).then(employ=>{
    if(employ)
    {
      res.json({success:1,data:employ})
    }
    else
      {{
        res.json({success:0,data:[]})
      }}
  })
})



module.exports = router;
