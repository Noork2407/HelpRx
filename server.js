var express = require("express");
var fileuploader=require("express-fileupload");//pic uploar or file upload
var app = express();
var mysql = require("mysql");
require("dotenv").config();
app.listen(2007, function()
{
    console.log("server started...");
})

app.use(express.static("public")); 
app.use(fileuploader());//pic uploar or file upload

const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'parnoork24@gmail.com', // Replace with your Gmail email address
    pass: process.env.PASSG, // Replace with your Gmail password
  },
});



app.get("/profile",function(req,resp)
 {
   resp.contentType("text/html");
    resp.sendFile(process.cwd()+"/public/profile.html");
 })
 
 app.get("/admin",function(req,resp)
 {
   resp.contentType("text/html");
    resp.sendFile(process.cwd()+"/public/dash-admin.html");
 })

 //===========DATABASE CONNECTIVITY============
var dbConfig={
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'Project',
    dateStrings: true

 }

 var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function(jasoos)
{
   if(jasoos==null)
  console.log("connected succesfully..");
  else
  console.log(jasoos);

}
)

//======= SUBMIT======
app.use(express.urlencoded(true));
app.post("/profile-donor-db-signup", function(req,resp)
{
   //resp.send("Welcome="+req.body.txtname+" "+req.body.txtpass);
   
   var fileName="nopic.jpg";
   if(req.files!=null)
   {
      fileName = req.files.ppic.name;
      var path = process.cwd()+"/public/uploads/"+fileName;
      req.files.ppic.mv(path); // moves the file tp required path*/
     // console.log(process.cwd());
   }
   //console.log(req.body);
  // resp.send("File = "+fileName);

   var semail = req.body.txtEmail;
   var sname = req.body.txtName;
   var sphone = req.body.txtPhone;
   var sadd = req.body.txtAdd;
   var scity = req.body.txtCity;
   var sdob = req.body.txtdob;
   var sgen = req.body.txtGender;
   var sid = req.body.txtIDProof;
  // var stime = req.body.txtFrom + req.body.txtTo;
  var sfrom = req.body.txtFrom;
  var sto = req.body.txtTo;

   dbCon.query("insert into donor(email,name,mobile,address,city,dob,gender,id,idpicname,availablefrom,availableto) values(?,?,?,?,?,?,?,?,?,?,?)",[semail,sname,sphone,sadd,scity,sdob,sgen,sid,fileName,sfrom,sto],function(err)
   {
      if(err==null)
      resp.redirect("Successful.html");
      else
      resp.send(err);
   })


})

//======= Update======
app.use(express.urlencoded(true));
app.post("/profile-donor-db-update", function(req,resp)
{
   //resp.send("Welcome="+req.body.txtname+" "+req.body.txtpass);
   
   var fileName="nopic.jpg";
   if(req.files!=null)
   {
      fileName = req.files.ppic.name;
      var path = process.cwd()+"/public/uploads/"+fileName;
      req.files.ppic.mv(path); // moves the file tp required path*/
     // console.log(process.cwd());
   }
   //console.log(req.body);
  // resp.send("File = "+fileName);

   var semail = req.body.txtEmail;
   var sname = req.body.txtName;
   var sphone = req.body.txtPhone;
   var sadd = req.body.txtAdd;
   var scity = req.body.txtCity;
   var sdob = req.body.txtdob;
   var sgen = req.body.txtGender;
   var sid = req.body.txtIDProof;
 //  var stime = req.body.txtFrom + req.body.txtTo;
   var sfrom = req.body.txtFrom;
   var sto = req.body.txtTo;


   dbCon.query("update donor set name=?,mobile=?,address=?,city=?,dob=?,gender=?,id=?,idpicname=?,availablefrom=?,availableTo=?where email=?",[sname,sphone,sadd,scity,sdob,sgen,sid,fileName,sfrom,sto,semail],function(err)
   {
      if(err==null)
      resp.redirect("Successful.html");
      else
      resp.send(err);
   })


})

//======================delete============
app.use(express.urlencoded(true));
app.post("/profile-donor-db-delete", function(req,resp)
{
   
  var semail = req.body.txtEmail;
 

   dbCon.query("delete from donor where email=?",[semail],function(err,result) // ek m error ki reporting hogi ek m jo query ka result h
   {
      if(err==null)
      {
         if(result.affectedRows==1)    // if acoount exists 
         {
          resp.redirect("Successful.html");
         }
         else
         {
            resp.send("Invalid emailid");
         }

      }
      
      else
      resp.send(err);
   })


})

//------------JSON SEARCH --------------
/*app.get("/get-json-record",function(req,resp)
{
      console.log("hit json");
    dbCon.query("select * from profile where emailid=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
          {
            console.log("han");
            resp.json("hi");
          }
              else
            resp.send(err);
    })
})*/

app.get("/get-json-record", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT * FROM donor WHERE email=?", [req.query.kuchEmail], function(err, resultTableJSON) {
     if (err == null) {
      if(resultTableJSON.length==1)
      {
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
      }
      else 
      resp.json("new user");
      
     } else {
       resp.send(err);
     }
   });
 });

 

//==================INDEX PAGE=====================

app.get("/",function(req,resp)
 {
   resp.contentType("text/html");
    resp.sendFile(process.cwd()+"/public/index.html");
 })
//----------------------------------

app.get("/chk-email",function(req,resp)
{
                             
    dbCon.query("select * from users where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
          if(err==null)       
          {
            if(resultTable.length==1)
            {
               resp.send("Already Taken...");
            }
              
            else
            {
              
               resp.send("Available....!!!!");
            }
             
            }
              else
            resp.send(err);
    })
})

//----------------------------------------
app.get("/signup-data",function(req,resp)
{
   

   dbCon.query("insert into users(email, pwd, type, dos, status) values (?,?,?,CURRENT_DATE(),?)",[req.query.kuchEmail,req.query.kuchPassword,req.query.kuchType,1],function(err,resultTable)
   {
      if(err==null)
      {
         resp.send("Signup Successful");
      }
      else
      resp.send(err);
   })
})
//------------email sender---------------------

app.post('/send-email', (req, res) => {
  const { kuchEmail, kuchType } = req.body;

  const mailOptions = {
    from: 'your_email',
    to: kuchEmail,
    subject: 'Welcome to Help Rx',
    text: `Hello ${kuchType},\n\nWelcome to Help Rx! Thank you for signing up.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully!');
    }
  });
});

//-------------------------------------------------------

app.get("/chk-email-login",function(req,resp)
{
  // console.log("hit");               
    dbCon.query("SELECT type,status FROM users WHERE email = ? AND pwd = ? ", [req.query.kuchEmail, req.query.kuchPassword],function(err,result)
    {
          if(err==null)       
          {
            if(result.length==1)
            {
              // console.log(result[0].type);
              if(result[0].status==1)
               resp.send(result[0].type);
               else
               resp.send("You are blocked!")
            }
              
            else
            {
              
               resp.send(" Not Available....!!!!");
            }
             
            }
              else
            resp.send(err);
    })
})

//-----------------avail meds---------------------


app.get("/avail-med-data", function(req, resp) {
   console.log("hit json");
   dbCon.query("insert into medsavailable(email, med, expdate, packing, qty) values (?,?,?,?,?)",[req.query.kuchEmail,req.query.kuchMedicine,req.query.kuchExpiry,req.query.kuchPacking,req.query.kuchQty],function(err,resultTable)
   {
      if(err==null)
      {
         console.log("in if");
         resp.send("Avail Successful");
      }
      else
      resp.send(err);
   })
 })
 //-----------------settings donor-----------
 app.get("/chk-password",function(req,resp)
{
               console.log("in chk")              
    dbCon.query("select * from users where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
          if(err==null)       
          {
            console.log('hi');
            if(resultTable.length==1)
            {
               console.log("hili");
               console.log(resultTable);
               resp.send(resultTable[0].pwd);
            }
              
            else
            {
              
               resp.send("IncorrectPassword");
            }
             
            }
              else
           resp.send(err);
           
    })
})
//-------------------------

app.get("/update-password",function(req,resp)
{
   

   dbCon.query("update users set pwd=? where email =?",[req.query.kuchPwd,req.query.kuchEmail],function(err,resultTable)
   {
      if(err==null)
      {
         resp.send("Updated Successfully");
      }
      else
      resp.send(err);
   })
})



//==============================profile-needy=======
app.get("/get-json-needy-record", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT * FROM needy WHERE email=?", [req.query.kuchEmail], function(err, resultTableJSON) {
     if (err == null) {
      if(resultTableJSON.length==1)
      {
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
      }
      else 
      resp.json("new user");
      
     } else {
       resp.send(err);
     }
   });
 });


 //----------------------------------
 
 app.post("/profile-needy-db-signup", function(req,resp)
{
   //resp.send("Welcome="+req.body.txtname+" "+req.body.txtpass);
   
   var fileName="nopic.jpg";
   if(req.files!=null)
   {
      fileName = req.files.ppic.name;
      var path = process.cwd()+"/public/uploads/"+fileName;
      req.files.ppic.mv(path); // moves the file tp required path*/
     // console.log(process.cwd());
   }
   //console.log(req.body);
  // resp.send("File = "+fileName);

   var semail = req.body.txtEmail;
   var sname = req.body.txtName;
   var sphone = req.body.txtPhone;
   var sadd = req.body.txtAdd;
   var scity = req.body.txtCity;
   var sdob = req.body.txtdob;
   var sgen = req.body.txtGender;


 
   dbCon.query("insert into needy(email,name,mobile,address,city,dob,gender,idproofpic) values(?,?,?,?,?,?,?,?)",[semail,sname,sphone,sadd,scity,sdob,sgen,fileName],function(err)
   {
      if(err==null)
      resp.redirect("Successful.html");
      else
      resp.send(err);
   })


})
//--------------------------------------
app.use(express.urlencoded(true));
app.post("/profile-needy-db-update", function(req,resp)
{
   //resp.send("Welcome="+req.body.txtname+" "+req.body.txtpass);
   
   var fileName="nopic.jpg";
   if(req.files!=null)
   {
      fileName = req.files.ppic.name;
      var path = process.cwd()+"/public/uploads/"+fileName;
      req.files.ppic.mv(path); // moves the file tp required path*/
     // console.log(process.cwd());
   }
   //console.log(req.body);
  // resp.send("File = "+fileName);

   var semail = req.body.txtEmail;
   var sname = req.body.txtName;
   var sphone = req.body.txtPhone;
   var sadd = req.body.txtAdd;
   var scity = req.body.txtCity;
   var sdob = req.body.txtdob;
   var sgen = req.body.txtGender;


 
   dbCon.query("update needy set name=?,mobile=?,address=?,city=?,dob=?,gender=?,idproofpic=? where email=?",[sname,sphone,sadd,scity,sdob,sgen,fileName,semail],function(err)
   {
      if(err==null)
      resp.redirect("Successful.html");
      else
      resp.send(err);
   })



})

//=================panel-users===========


app.get("/get-angular-users-all-records", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT * FROM users ",function(err, resultTableJSON) {
     if (err == null) {
     
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
    
     } else {
       resp.send(err);
     }
   });
 });

//------------------------------------------
 app.get("/get-angular-users-block", function(req,resp){
   console.log("in sev");
   dbCon.query("update users set status=? where email=? ",[0,req.query.kuchEmail],function(err, resultTableJSON) {
      if (err == null) {
          console.log("users block");
          resp.send("user blocked"); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });

 })

 //-------------------------------------
 app.get("/get-angular-users-resume", function(req,resp){
   console.log("in sev");
   dbCon.query("update users set status=? where email=? ",[1,req.query.kuchEmail],function(err, resultTableJSON) {
      if (err == null) {
          
          resp.send("user resumed"); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });

 })
 
 //==========panel-donor============
 app.get("/get-angular-donors-all-records", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT * FROM donor ",function(err, resultTableJSON) {
     if (err == null) {
     
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
    
     } else {
       resp.send(err);
     }
   });
 });

 //----------------------
 app.get("/get-angular-donors-delete", function(req,resp){
   console.log("hit ");
   dbCon.query("delete from donor where email=? ",[0,req.query.kuchEmail],function(err, resultTableJSON) {
      if (err == null) {
          console.log("users deleted");
          resp.send("user deleted"); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });

 })

 //===========panel needy=================
 app.get("/get-angular-needy-all-records", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT * FROM needy ",function(err, resultTableJSON) {
     if (err == null) {
     
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
    
     } else {
       resp.send(err);
     }
   });
 });

 //----------------------
 app.get("/get-angular-needy-delete", function(req,resp){
   console.log("hit ");
   dbCon.query("delete from needy where email=? ",[0,req.query.kuchEmail],function(err, resultTableJSON) {
      if (err == null) {
          console.log("users deleted");
          resp.send("user deleted"); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });

 })
//===========================medicine Manager====
app.get("/get-angular-medicines-all-records", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT * FROM medsavailable where email=?",[req.query.kuchEmail],function(err, resultTableJSON) {
     if (err == null) {
     
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
    
     } else {
       resp.send(err);
     }
   });
 });
 //-----------------------------
 app.get("/get-angular-medicines-delete", function(req,resp){
   console.log("hit ");
   dbCon.query("delete from medsavailable where srno=? ",[req.query.kuchSno],function(err, resultTableJSON) {
      if (err == null) {
          console.log("Deleted");
          resp.send("Deleted"); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });

 })
 //=========MEDICINE-FINDER===========
 app.get("/get-angular-find-medDonors-city", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT distinct city FROM donor ",function(err, resultTableJSON) {
     if (err == null) {
     
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
    
     } else {
       resp.send(err);
     }
   });
 });

 //-------------------------------
 app.get("/get-angular-find-medAvail-med", function(req, resp) {
   console.log("hit json");
   dbCon.query("SELECT distinct med FROM medsavailable ",function(err, resultTableJSON) {
     if (err == null) {
     
         console.log(resultTableJSON.length);
         resp.json(resultTableJSON); // Send the JSON object as the response
    
     } else {
       resp.send(err);
     }
   });
 });
 //--------------------------------

 app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.medKuch;
  var city=req.query.cityKuch;

  var query="select donor.email, donor.name, donor.mobile, donor.address, donor.id, donor.idpicname, donor.availablefrom, donor.availableto , medsavailable.med, medsavailable.expdate, medsavailable.qty, medsavailable.packing from DONOR inner join MEDSAVAILABLE on donor.email= medsavailable.email where medsavailable.med=? and donor.city=?";
  

  dbCon.query(query,[med,city],function(err,resultTable)
  {
    console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})