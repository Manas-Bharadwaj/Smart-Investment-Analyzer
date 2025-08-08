const express=require('express');
const path=require('path');
const bcrypt=require('bcrypt');
const collection =require("./config");
const Project =require("./project");
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
const session = require("express-session");

app.use(session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  

app.get("/",(req,res)=>{
    res.render("home");

});
app.get("/about",(req,res)=>{
    res.render("about");

});

app.get("/login",(req,res)=>{
    res.render("login");

});
app.get("/home",(req,res)=>{
    res.render("home");

});
app.get("/signup",(req,res)=>{
    res.render("signup");

});
app.get("/home1",(req,res)=>{
    res.render("home1");

});
app.get("/ipform",(req,res)=>{
    res.render("ipform");

});
app.get("/result", (req, res) => {
    const data = req.session.resultData;
    console.log(data);
    if (!data) return res.redirect("/ipform");

    res.render("result", data);
});


app.post("/signup",async (req,res)=>{
    console.log("hi");
    const data={
email: req.body.Email,
password:req.body.Password

}
const existinguser=await collection.findOne({email:data.email});
if(existinguser){
 res.send("User already exisits.")
}else{
    const saltRounds=10;
    const hashPassword=await bcrypt.hash(data.password,saltRounds);
    data.password=hashPassword;
const userdata=await collection.insertMany(data)
res.render("login");
}
});

app.post("/login",async (req,res)=>{
    const data={
        email: req.body.Email,
        password:req.body.Password
        
        }
        try{
           const check=await collection.findOne({email:data.email}) ;
           if(!check){
            return res.send("User Not Found");
           }
        //    const passwordmatch=await collection.findOne({password:data.password});
           const ispassword=await bcrypt.compare(req.body.Password,check.password);
           if(ispassword){
            res.render("home1");
           }else{
            res.send("wrong password");
           }
        }catch{
            res.send("no re");

        }



});
app.post("/ipform", (req, res) => {
    console.log("Received data:", req.body);

    const { initialInvestment, discountRate, cashFlows } = req.body;

    // Parse input values
    const parsedCashFlows = cashFlows.map(v => parseFloat(v)).filter(v => !isNaN(v));
    const rate = parseFloat(discountRate) ;  // Use /100 if user enters percentage like "10" for 10%
    const initial = parseFloat(initialInvestment);

    // Validate inputs
    if (isNaN(initial) || isNaN(rate) || parsedCashFlows.length === 0) {
        return res.status(400).send("Invalid input values.");
    }

    // --- NPV Calculation ---
    let npv = -initial;
    parsedCashFlows.forEach((cf, i) => {
        npv += cf / Math.pow(1 + rate, i + 1);
    });

    // --- PI Calculation ---
    const pi = (npv + initial) / initial;

    // --- IRR Calculation using Newton-Raphson ---
    const estimateIRR = (cashFlows, initial, guess = 0.1) => {
        let irr = guess;
        let maxIterations = 1000;
        let tolerance = 0.00001;
    
        for (let i = 0; i < maxIterations; i++) {
            let npv = -initial;
            let derivative = 0;
    
            cashFlows.forEach((cf, j) => {
                let t = j + 1;
                npv += cf / Math.pow(1 + irr, t);
                derivative -= t * cf / Math.pow(1 + irr, t + 1);
            });
    
            const newIrr = irr - npv / derivative;
    
            if (Math.abs(newIrr - irr) < tolerance) {
                return newIrr * 100; // Return IRR in %
            }
    
            irr = newIrr;
        }
    
        return irr * 100; // Return IRR in % even if not fully converged
    };
    

    const irr = estimateIRR(parsedCashFlows, initial);
    const isProfitable = npv > 0;

    // --- Store Results in Session ---
    req.session.resultData = {
        initialInvestment: initial,
        discountRate: discountRate,
        cashFlows,
        npv: parseFloat(npv.toFixed(2)),
        pi: parseFloat(pi.toFixed(2)),
        irr: parseFloat(irr.toFixed(2)),
        isProfitable
    };

    // Optional: console log for debug
    console.log("Result Data:", req.session.resultData);

    res.redirect("/result");
});








const port=5000;
app.listen(port,()=>{
    console.log("Server Started")
})