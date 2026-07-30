
console.log("====================================");
console.log(">>> MY SERVER FILE IS EXECUTING <<<");
console.log("====================================");
require('dotenv').config()
const express=require('express')
const supabse=require('./supabaseClient')
const app = express();
app.use(express.json());
const PORT =  8080;
app.get('/',(req,res)=>{
    console.log("===> HIT CAME TO SERVER <===");
  res.send('server is running')
})



const server=app.listen(PORT ,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

