const express = require("express");
const app = express();
const cors = require("cors");
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//eqrERraPrtJF8iH3
//toymoy

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://toymoy:eqrERraPrtJF8iH3@cluster0.gny4dya.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



    // //verify jwt function
    // const verifyJWT =(req, res, next)=>{
    //   const authorization = req.headers.authorization;
    //   if(!authorization){
    //     return res.status(401).send({error: true, message: 'unauthorized access'})
    //   }
    //   const token = authorization.split(' ')[1];
    //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded)=>{
    //     if(error){
    //       return res.status(403).send({error: true, message: 'unauthorized access'})
    //     }
    //     req.decoded = decoded;
    //     next()
    //   })

    // }

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db("toymoy").collection("toys");
    const postCollection = client.db("toymoy").collection("posts");



//JWT
app.post('/jwt', (req,res)=>{
  const user = req.body;
  // console.log(req.headers.authorization);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  res.send({token})
})


    app.post("/toys", async (req, res) => {
      const newtoys = req.body;
      const result = await toyCollection.insertOne(newtoys);
      res.send(result);
    });


    app.get("/toys", async (req, res) => {
      const data = toyCollection.find();
      const result = await data.toArray();
      res.send(result);
    });


    //get some data by spesipc user
    // app.get('/toys', verifyJWT, async(req, res)=>{
    //   const decoded = req.decoded;
    //   console.log(decoded);
    //   if(decoded.email !== req.query.email){
    //     return res.status(403).send({error:1, message: 'forbidden access'})
    //   }
    //   let quary ={};
    //   if(req.query?.email){
    //     quary = {email: req.query.email}
    //   }
    //   const result = await toyCollection.find(quary).toArray()
    //   res.send(result)
    // })


    app.get('/toys/:id', async (req, res) => {
      const id= req.params.id;
      const quary ={_id: new ObjectId(id)}
      const result = await toyCollection.findOne(quary)
      res.send(result);
    });


    
    app.delete('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(quary)
      res.send(result)
    })


 //Update from client to server
app.put('/toys/:id', async(req , res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true}
  const updateToy =req.body;
  const valuinfo ={
    $set:{
      name: updateToy.name,
      chef: updateToy.company,
      supplier: updateToy.supplier,
      taste: updateToy.type,
      category: updateToy.category,
      details: updateToy.height,
      photo: updateToy.weight,
      price: updateToy.price,
      date: updateToy.date,
      meterial: updateToy.meterial,
      gender: updateToy.gender,
      model: updateToy.model,
      stock: updateToy.stock,
      colors: updateToy.colors,
      email: updateToy.email
    }
  }
  const result = await toyCollection.updateOne(filter, valuinfo, options)
  if (result.matchedCount > 0 || result.upsertedCount > 0) {
    // Successful update, send a response
    res.send({ success: true, message: 'Toy updated successfully' });
  } else {
    // No matching document found
    res.status(404).send({ success: false, message: 'Toy not found' });
  }
})




    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.post("/posts", async (req, res) => {
      const posts = req.body;
      console.log(posts);
      const result = await postCollection.insertOne(posts);
      res.send(result);
    });

    // app.get("/myposts", async(req, res) => {
    //   const data = postCollection.find();
    //   const result = await data.toArray();
    //   res.send(result);
    // });


    
//get some data by spesipc user
app.get('/myposts', async(req, res)=>{
  console.log(req.query.email);
  let quary ={}
  if(req.query?.email){
    quary = {email: req.query.email}
  }
  const result = await postCollection.find(quary).toArray()
  res.send(result)
})

    app.get('/myposts/:id', async (req, res) => {
      console.log(req.query.email);
      const id= req.params.id;
      const quary ={_id: new ObjectId(id)}
      const result = await postCollection.findOne(quary)
      res.send(result);
    });

    app.delete('/myposts/:id', async(req, res)=>{
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)}
      const result = await postCollection.deleteOne(quary)
      res.send(result)
    })


//update post
app.put('/myposts/:id', async(req , res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true}
  const updatePost =req.body;
  const valuinfo ={
    $set:{
      title: updatePost.title,
      author: updatePost.author,
      description: updatePost.description,
      category: updatePost.category,
      paragraph1: updatePost.paragraph1,
      paragraph2: updatePost.paragraph2,
      Conclusion: updatePost.Conclusion,
      date: updatePost.date,
      PostImage: updatePost.PostImage,
      email: updatePost.email
    }
  }
  const result = await postCollection.updateOne(filter, valuinfo, options)
  if (result.matchedCount > 0 || result.upsertedCount > 0) {
    // Successful update, send a response
    res.send({ success: true, message: 'Toy updated successfully' });
  } else {
    // No matching document found
    res.status(404).send({ success: false, message: 'Toy not found' });
  }
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
