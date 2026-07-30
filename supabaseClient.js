require('dotenv').config()
const {createClient}=require('@supabase/supabase-js')
const supabseUrl=process.env.SUPABASE_URL
const supabaseKey=process.env.SUPABASE_KEY

if(!supabseUrl || !supabaseKey){
    console.log('Environment variable missing')
    process.exit(1)
}

const supabse=createClient(supabseUrl,supabaseKey)

module.exports=supabse