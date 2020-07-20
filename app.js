//jshint esversion:6
// Mon 20/7/20  // L-402 :Authentication and Security
// hyper steps 1. npm init 2. npm i express body-parser ejs mongoose
// step12 npm npm install dotenv and require advise to do this first
require('dotenv').config();

// step 1 the starting file
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// step 8
// https://www.npmjs.com/package/mongoose-encryption
// npm install mongoose-encryption in hyper and require
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//TODO
// step2 connect mongoose
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology: true});

// step 4 create a user Database by creating a Schema
// step 10 created a new mongooseSchema according to mongoose-encryption usage
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// step11 creating a secret (https://www.npmjs.com/package/mongoose-encryption) Secret String Instead of Two Keys:Encrypt Only Certain Fields
// const secret = "Thisisourlittlesecret."; MOVED TO .env file()
userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });

// step5 create userModel
const User = new mongoose.model("User",userSchema);


 // step3
app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});


// step6 create a register route and newUser
app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

// step7 create a login route
app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    } else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
