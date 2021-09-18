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
    if(req.session.auth_user.role == "employ")
    // console.log("auth user is ===================",req.session.auth_user)
    res.redirect('/update/profile')
    else
      res.redirect('/list/employ')
  }
});



router.get('/add/employ', function(req, res) {
 
  if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  res.render('index', { title: 'Express' ,req});
  }
  else
{
  res.redirect("/")
}

});


router.get('/list/employ',function(req,res){
    if(req.session.auth_user && req.session.auth_user.role != "employ")
  {
  Employ.find({}).then(employs=>{
    res.render('employ',{employs})
  })
}
else
{
  res.redirect("/")
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
else
{
  res.redirect("/")
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
else
{
  res.redirect("/")
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
else
{
  res.redirect("/")
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
      res.json({success:0,message:"Please enter valid email  and password"})

    }
  })

})

router.post('/api/admin/login',function(req,res){
  var {email,password,role} =req.body
  Admin.findOne({email:email.trim(),password:password.trim()},{password:0}).then(employ=>{
    if(employ)
    {
      req.session.auth_user=employ
      res.json({success:1,message:"User logged in successfully"})
    }  
    else
    {
      res.json({success:0,message:"Please enter valid email  and password"})

    }
  })

})

router.get("/api/user/logout",function(req,res){
delete req.session.auth_user;
      res.json({success:1,message:"User logged out successfully"})
})


router.post('/api/update/user',function(req,res){
  var {name,skills,phone,address}= req.body
  if(req.session.auth_user && req.session.auth_user.email)
  {

   Employ.findOne({email: req.session.auth_user.email}).then(employ=>{
    if(employ)
    {
      employ.name=name
      // employ.email = email
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


router.get('/api/search/name/:name',function(req,res){
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

router.get('/api/search/allocated_project/:project',function(req,res){
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

router.get('/api/search/address/:location',function(req,res){
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

router.get('/api/search/designation/:designation',function(req,res){
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
