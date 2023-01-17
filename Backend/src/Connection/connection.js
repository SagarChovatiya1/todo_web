const mongoose = require("mongoose");
let URL= "mongodb+srv://avanish-Elision:Elision%40123@cluster0.vp9jlbc.mongodb.net/?retryWrites=true&w=majority"
// let URL="mongodb+srv://tomramtest:Elision%40123@cluster0.qsmugw1.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', false);

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connection is done")
})
.catch((err)=>{
    console.log(err)
})