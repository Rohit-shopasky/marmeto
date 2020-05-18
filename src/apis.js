
const Model = require('./dbModel')
const { userModel} = Model
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwtSecret = "@test@";
const common = require("./common");
const moment = require("moment");

module.exports = (app)=> {

    app.post("/signup",async(req,res)=>{

        let {firstName,lastName,email,mob,password} = req.body;

        try {
            if(firstName!='' && lastName!='' && mob!=''&& email!='' && password!=''){

                if(email.indexOf("@")!=-1) // check email syntax
                {
                  let userRef = userModel();
                  userRef.firstName = firstName.charAt(0).toUpperCase();
                  userRef.lastName = lastName.charAt(0).toUpperCase();
                  userRef.email = email;
                  userRef.mob = mob;
                  userRef.password = passwordHash.generate(password);

                  // check if user already signup or not
                  let findResult = await userModel.findOne({email:email});
                  
                  if(!findResult)
                  {
                     // insert into db
                     let result = await userModel.collection.insert(userRef);
                      console.log(result.insertedIds[0]);
                     // send mail
                     let mailUri = "http://localhost:3001/verify?userId=" + result.insertedIds[0];
                     let text = "Please click on the link to verify your email " + mailUri;
                     common.sendMail(email,"Please verifiy your email",mailUri);

                     res.json({status:true,msg:"User created, In case gmail blocks less secure apps to send password via nodemailer i am providing you the verification link for testing purpose :" + mailUri  +" You can query this api on postman"});


                  }
                  else
                  res.json({status:false,msg:"Email already exists!"})

                }
                else
                res.json({status:false,msg:"Email is incorrect!"})
            }
            else
            res.json({status:false,msg:"All Parameters are required!"});

            
        } catch (error) {
            console.log("err",error);
            res.json({status:false,msg:"Something went wrong!"})

        }  
    })


    app.get("/verify",async(req,res)=>{
        let {userId} = req.query;

        let result = await userModel.findOne({_id:userId});
        if(result){
          

            // check if it is first time verification
            if(result.isVerified==true)
            {
                res.json({status:true,msg:"User already verified. Signin using ->  http://localhost:3001/signin  (Post api)"})
            }

            let registerDate = result.emailVerificationTime;
            signupTime = registerDate.toISOString();
            let comp = moment(signupTime).add(1, 'minutes').utc().format();

            // expire in 10 mins
            
            let current = new Date().toISOString();
            console.log("current",current);

            if(current>=comp)
            {
                res.json({status:false,msg:"Link Expired"})
            }
            else{

                // update user verified
                let updateResult = await userModel.findOneAndUpdate({"_id":userId},{$set:{isVerified:true}});

                res.json({status:true,msg:"Signin using ->  http://localhost:3001/signin  (Post api)"});
            }
        }
    })


    app.post("/signin",async(req,res)=>{
        let {email,password} = req.body;

        try {

            let result =await userModel.findOne({email:email})
       // console.log("result",result);
        if(result){

            if(result.isVerified==false)
            {
                res.json({status:false,msg:"Please verify your email"});
                return
            }
             console.log(result.password +  " " + password);
            let isPassMatch = passwordHash.verify(password, result.password);
           // console.log(isPassMatch);
            if(isPassMatch)
            {
               let token = jwt.sign({ val:email},jwtSecret);
               let updateRes = await userModel.findOneAndUpdate({email:email},{$set:{token:token}});
               console.log(updateRes);
               res.json({status:true,msg:"Sucess signin",token:token});

            }
            else
            {
                res.json({status:false,msg:"Incorrect Password"})
            }

        }
        else
        {
            res.json({status:false,msg:"email not exists!"})
        }
            
        } catch (error) {
         console.log("errpr",error);   
         res.json({status:false,msg:"Something went wrong!"})
        }
        
        
    })

}