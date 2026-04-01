const path = require('path');

const express = require('express');
const app = express();

require('dotenv').config();

const uri = process.env.MONGO_URI;
const db = process.env.DB_NAME;
const PORT = process.env.PORT;
if (!uri) {
  console.error("Error: MONGODB_URI is undefined. Check your .env file!");
  process.exit(1);
}
//-----------------------------------------------------------------------------------------------------------------------------------------
const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {t
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
connectDB();
run().catch(console.dir);
//-------------------------------------------------------------------------------------------------------------------------------------------------

const userCollection = db.collection
app.use(express.static('./'))
app.use(express.json());
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'fe','loginPage.html'))
});
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'fe','signupPage.html'))

});
/*app.post("/login",(req,res)=>{
    console.log(req.body);
    res.json({success:true,message:"Login data saved"})*/

});
app.post("/signup",async (req,res)=>{
    try {
        const{ name, phone, password}=  req.body;
        const existingUser = await userCollection.findOne({name, phone})
        if(existingUser){
            res.send('name or phone taken already')
        }
        const result = await userCollection.insertOne({name,email,password});
        res.send({success:true,message:"user created",id:result.insertId});}
    catch (err){
        console.log(err+'<---this is error')
        }

});

app.listen(PORT,()=>{
    console.log('server is online');
});


