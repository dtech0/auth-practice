

require('dotenv').config()
const express=require('express')
const supabase=require('./supabaseClient')
const app = express();
app.use(express.json());
const PORT =  8080;
const swaggerUi = require('swagger-ui-express');
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
app.post('/auth/signup',async (req,res)=>{
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
app.post('/auth/login',async(req,res)=>{
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
app.get('/public/info',(req,res)=>{
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

// protected/dashboard
app.get('/protected/dashboard', middleware, (req, res) => {
  return res.status(200).json({
    message: `Welcome to the private dashboard, ${req.user.email}!`
  });
});


//swaggerUI

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Practice API',
    version: '1.0.0',
    description: 'Express.js & Supabase Auth API with Bearer Token protection'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/public/info': {
      get: {
        summary: 'Public Info',
        tags: ['Public'],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/auth/signup': {
      post: {
        summary: 'Register new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'testuser@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'User Created' }, 400: { description: 'Bad Request' } }
      }
    },
    '/auth/login': {
      post: {
        summary: 'User Login & get JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'testuser@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'User Logout',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: { 204: { description: 'No Content' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/protected/profile': {
      get: {
        summary: 'Get Private Profile',
        tags: ['Protected'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/protected/dashboard': {
      get: {
        summary: 'Get Protected Dashboard',
        tags: ['Protected'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' }, 401: { description: 'Unauthorized' } }
      }
    }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/docs`);
});
