const mongoose=require("mongoose");

const struct =mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    useref_id:mongoose.Schema.Types.ObjectId
})
const result=mongoose.model("notes",struct)
module.exports=result