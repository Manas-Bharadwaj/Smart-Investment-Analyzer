require('dotenv').config({ path: './src/.env' });

const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGODB_URI);
connect.then(()=>{
    console.log("Database Connected");
})
.catch(()=>{
    console.log("Database Cannot be Connected");
});

const loginscema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection= new mongoose.model("users",loginscema);
module.exports = collection;
