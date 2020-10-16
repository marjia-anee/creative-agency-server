const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');


const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tantc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(''));
app.use(fileUpload())

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const serviceCollection = client.db("creativeAgency").collection("services");
  
  const reviewCollection = client.db("creativeAgency").collection("reviews");
  const orderCollection = client.db("creativeAgency").collection("orders");
  const adminCollection = client.db("creativeAgency").collection("admins");


  app.post('/addService', (req, res) => {
    const file=req.files.file
    const userName=req.body.userName
    const email=req.body.email
    const serviceTitle=req.body.serviceTitle
    const projectDetails=req.body.projectDetails
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    let image={
      contentType:file.mimetype,
      size:file.size,
      img:Buffer(encImg,'base64')
    }

    serviceCollection.insertOne({
    image, userName, email, serviceTitle, projectDetails})
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
});


  app.get('/showServices',(req, res)=>{
  serviceCollection.find({})
  .toArray((error,documents)=>{
    res.send(documents)
  })
})

app.get('/showServices/item/:_id', (req, res) => {
  productsCollection.find({ _id: ObjectId(req.params._id) })
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
})



  app.post('/addOrder', (req, res) => {
    const file=req.files.file
    const userName=req.body.userName
    const email=req.body.email
    const serviceTitle=req.body.serviceTitle
    const projectDetails=req.body.projectDetails
    const price=req.body.price

    const newImg = file.data;
    const encImg = newImg.toString('base64');
    
      let image={
        contentType:file.mimetype,
        size:file.size,
        img:Buffer(encImg,'base64')
      }

      orderCollection.insertOne({
        image, userName, email, serviceTitle, projectDetails,price
      })
      .then(result=>{
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/showOrders', (req, res) => {
    orderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.get('/serviceList',(req,res)=>{
    orderCollection.find({})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })

  app.post('/addReview',(req, res)=>{
    reviewCollection.insertOne(req.body)
    .then(result=> {
      res.send(result.insertedCount > 0)
    })
    .catch(err=>{
      console.log(err)
    })
  })

  app.get('/showReviews',(req,res)=>{
    reviewCollection.find({})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })


  app.post('/addAdmin', (req, res) => {
    adminCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/admin', (req, res) => {
    adminCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  




});


app.listen(process.env.PORT || port)