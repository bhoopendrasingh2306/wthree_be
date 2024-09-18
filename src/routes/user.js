const express = require("express");
const validator = require("validator");
const passwordValidator = require("password-validator");
const router = express.Router();
const userdb = require("../db/user");
const referaldb = require("../db/referal");
const jwt = require("jsonwebtoken");
const jwtKey = "my-key";

// const accessControl = require("../middlewares/jwt_verification");

// ------------------REGISTER NEW USER---------------------------

//http://localhost:5000/user/signup
router.post("/signup", async (req, resp) => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces();
  try {
    const password = req.body.password;
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(passcode, salt);
    const { name, email } = req.body;
    // const password = hashedPassword;
    const srno = parseInt(Math.floor(Math.random() * (500 - 1 + 1) ) + 1);
    const date = new Date();
    const result = {
        name:name,
        srno:srno,
        email:email,
        password:password,
        selfEarning:0.00,
        referralEarning:0,
        rewardEarning:0,
        amount:0,
        date: date.toLocaleString(),
        details:"referral-Kyc",
        userStatus:"Premium",
        // img_url:{
        //     require:false,
        //     type:String,
        // },

      
    };
    let Token;
    console.log(result);
    if (!validator.isEmail(email)) {
      return resp.status(203).send({ message: "Invalid email address" });
    }
    //password validation check
    const isValid = schema.validate(password);
    if (!isValid) {
      return resp.status(203).send({ message: "Password is not valid" });
    }
    let userCheck = await userdb.findOne({ email: email });
    console.log("uZER chack:", userCheck);
    if (userCheck) {
      return resp.status(203).send({ message: "user already exists" });
    } else {
      // this jwt token will be generated when we signup
      jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ message: "something went wrong or token expired" });
        } else {
          Token = token;
        }
      });
    }
    let valu = new userdb(result);
    let data = await valu.save();
    data = data.toObject();
    resp.status(200).send({ data, auth: Token });
  } catch (err) {
    console.log("end Err", err);
    resp.status(203).send({ message: "something went wrong" });
  }
});

//http://localhost:5000/user/login
router.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await userdb.findOne({ email: email });
  try {
    console.log("user information", user);
    if (user) {
      // const payload = { user };
      if (req.body.password === user.password) {
        //password resolution
        jwt.sign({ user }, jwtKey, { expiresIn: "5h" }, (err, token) => {
          //jwt token generation
          if (err) {
            res.send({ message: "something went wrong or token expired" });
          } else {
            res.status(200).send({ user, auth: token });
          }
        });
      } else {
        res.status(203).send({message:"wrong password"});
      }
    } else {
      return res.status(203).send({message:"cannot find user"});
    }
    // res.status(200).send({ user });
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});

// ---------------  GET PROFILE INFORMATION ------------------------

// //localhost:5000/user/profile/:srno
router.get("/profile/:srno", async (req, res) => {
  try {
    const result = await userdb.findOne({srno:req.params.srno});
    console.log("profile result", result);
    if (result) {
      res.status(200).send({ result: result });
    } else {
      res
        .status(203)
        .send({ message: "invalid srno or user profile not available" });
    }
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});


// ----------------------- get referral list----------------------------------
//localhost:5000/user/referral
router.get("/referral", async(req,res)=>{
  try{
    const result = await userdb.find();
    console.log("referal list", result.length);
    let arr=[];
    
    for(let i=0; i<result.length; i++){
      arr[i]=(result[i]);
    }
    console.log("arr", arr)
    res.status(200).send({ result: arr});
    
  }catch(err){
    res.status(203).json(console.log(err));
  }
})


// -----------------------------------------------------contect -------------------------------------

http://localhost:5000/student/contect
// router.post("/contect", async (req, resp) => {
//   try {
//     const { name, email, description } = req.body;
//     const result = {
//       name: name,
//       email: email,
//       description:description
//     };
    
//     console.log(result);
//     if (!validator.isEmail(email)) {
//       return resp.status(203).send({ message: "Invalid email address" });
//     }
//     let valu = new contectDb(result);
//     let data = await valu.save();
//     data = data.toObject();
//     resp.status(200).send({ data, message: "Your Feedback is successfully recorded."});
//   } catch (err) {
//     console.log("end Err", err);
//     resp.status(203).send({ message: "something went wrongg or institute code will be numeric" });
//   }
// });

module.exports = router;
