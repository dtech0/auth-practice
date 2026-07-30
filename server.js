

require('dotenv').config()
const express=require('express')
const supabase=require('./supabaseClient')
const app = express();
app.use(express.json());
const PORT =  8080;
app.get('/',(req,res)=>{
   // console.log("===> HIT CAME TO SERVER <===");
  res.send('server is running')
})

//signup api
app.post('/signup',async (req,res)=>{
    try{
        const {email,password}=req.body
    if(!email){
        return res.status(400).json({error:"email is required"})
    }
    if(!password){
        return res.status(400).json({error:"password is required"})
    }
    if(!email && !password){
        return res.status(400).json({error:"email and password is need"})
    }

    const result=await supabase.auth.signUp({email,password})
    const data=result.data
    const error=result.error
     if (error) {
      return res.status(400).json({
        error: error.message
      });
    }
    return res.status(200).json(
        {
            message: "User created successfully",
            user: data.user
        }
    )
    }
   catch(error){
        return res.status(500).json({ error: error.message });
    }

})
app.post('/login',async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        return res.status(400).json({error:"email and password is need"})
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }
  return res.status(200).json({
    access_token:data.session.access_token,
    refresh_token:data.session.refresh_token,
    user:data.user
  })
})



const server=app.listen(PORT ,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

