const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("Database connected")})
    .catch((e)=>{
        console.log("Database connection failed")
        console.error(e)
        process.exit(1);
    })
}

module.exports = connectdb