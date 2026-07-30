

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
//stage 4: Middleware protection & logout

const middleware=async (req,res,next)=>{
     const bearer=req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }
  const toekn =bearer.split(' ')[1]
  const {data:{user},error}=await supabase.auth.getUser(toekn)
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach verified user to request object
  req.user = user;
  next();
}

//logout
app.post('/auth/logout',middleware,async(req,res)=>{
    const{error}=await supabase.auth.signOut();
     if (error) {
    return res.status(400).json({ error: error.message });
  }
    return res.status(204).send();

})
//Stage 1
//Signup API
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

//login API
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

//Stage 2
//public route
app.get('/public/info',middleware,(req,res)=>{
    return res.status(200).json( {"message": "Welcome stranger! This info is public." })
})
//private route
// app.get('/protected/profile',(req,res)=>{
//        const bearer=req.headers.authorization

//        if(!bearer || !bearer.startsWith('Bearer ')){
//         return res.status(401).json({"message":"Access token required"})
//        }
//       return res.status(200).json({ message: 'Authorization header presented!' });
// })

// Stage 3: Protected Profile Route with Token Verification
app.get('/protected/profile',middleware,async(req,res)=>{
    const bearer=req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }
  const toekn =bearer.split(' ')[1]
  const {data:{user},error}=await supabase.auth.getUser(toekn)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  return res.status(200).json({
    id: user.id,
    email: user.email,
    created_at: user.created_at

  })
})
const server=app.listen(PORT ,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

