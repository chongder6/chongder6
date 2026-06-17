//required ------------------------------------------------------------
const express = require('express')
const app = express();

//const mongodb = require('mongodb')<--not use fully
const  {MongoClient}  = require('mongodb')

require('dotenv').config();//.env

const path = require('path')

const bcrypt = require('bcrypt')//encrypting pass word
//---------------------------------------------------------------------

//middleware-----------------------------------------------------------
app.use(express.static('./'));//FOR DEFINING PATH AS ROOT IN SERVER 
app.use(express.json());
//app.use(express.urlencoded({extended : true}));
//---------------------------------------------------------------------



//use .env file for security-------------------------------------------
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const URI = process.env.MONGO_URI;
//console.log(URI,DB_NAME) //-->for testing
//---------------------------------------------------------------------


//mongo setup----------------------------------------------------------
const client = new MongoClient(URI);

let db;
async function run(){
  try{
    await client.connect();
    db = await client.db(DB_NAME);
    
    
    const userCollection = await db.collection('users');
    //testing purposes   
    //await client.db("admin").command({ping:1});
    console.log('connected to database')
    //sends ping to server to check the server 
    
    //await client.close();
    //closes server or database
  }
  catch(err){
    console.error('connection to database is failed',err)
  }                             
}
run();///<<<----- run this 
//---------------------------------------------------------------------


//set up route params


//-----for sign up FE
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'fe','signupPage.html'))
    

})
//------for sign up BE
app.post('/',async(req,res)=>{
    try{
        const {name,phone,password}= req.body;
   
        if (!name || !phone ||!password){
            console.log(name,phone,password);
            return res.status(400).send('all fields are require')

        }

        const hashedPass = await bcrypt.hash(password, 10);//password hashing
        const existingUser = await db.collection('users').findOne({phone})
        if(existingUser){
            return res.status(400).send('please give unique credentials')
            //exit this function if user exist           
        }                                       
        //if userdont exist then this next command run                        
        const result = await db.collection('users').insertOne({name,phone,password:hashedPass})   
    
        res.json({                                                  
                success:true, 
                message:"user id created",
                id: result.insertedId,
                user:{name,phone}
        }) 
    }

     
    catch(error){
        console.log(error)
        res.status(500).send('something is off')
    }  
})

//-----for log in FE
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'fe','loginPage.html'))
})
//-----for log in BE
app.post('/login',async(req,res)=>{
    try{  
        const{name,phone,password}=req.body;
        console.log({name,phone,password})
        if (!name || !phone ||!password){
            
            return res.status(400).send('all fields are require')
        }
        const user = await db.collection('users').findOne({name,phone})
        if(!user){
            console.log(`user credentials doesn't match`)
            return res.status(400).send('please give right name and phone no.') 
        }
        const pass = await bcrypt.compare(password,user.password)
        if (pass){
            console.log('you logged in')
            res.status(200).send('you logged in successfully ')
        }    
        else{
            res.status(400).send('password doesnt match')
    }}
    catch(err)
    {
        res.status(500).send('error in server')
        console.log(err)
    }
})





//---------------------------------------------------------------------




//debuging

//---------------------------------------------------------------------




//starting server------------------------------------------------------
app.listen(PORT,()=>{
    console.log('server is online')
}) 
//---------------------------------------------------------------------


//info-----------------------------------------------------------------
/*
            Database(folder)
                |
                V
            Collection(file)
                |
                V       
            Documents(data inside file)

client.db() is to choose database

client.db().collection() used to choose collection

client.db().collection().findOne()----------|
client.db().collection().insertOne()        |----is used to modify file data
client.db().collection().updateOne()--------|

we define 
const db = client.db(DB_NAME)
SO WE CAN USE db. instead of client.db(DB_NAME)
*/

