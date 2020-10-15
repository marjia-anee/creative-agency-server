const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


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
  
  app.post('/addService', (req, res) => {
    const file=req.files.file
    const userName=req.body.userName
    const email=req.body.email
    const serviceTitle=req.body.serviceTitle
    const projectDetails=req.body.projectDetails
    const price=req.body.price
    
    const encImg=file.data.toString('base64')
      const image={
        contentType:file.mimetype,
        size:file.size,
        img:Buffer(encImg,'base64')
      }

      serviceCollection.insertOne({
        img:image, userName, email, serviceTitle, projectDetails,price
      })
      .then(result=>{
        console.log(result)
      })
  });

  app.get('/showServices',(req,res)=>{
    serviceCollection.find({})
    .toArray((error,documents)=>{
      res.send(documents)
    })
  })



});


app.listen(process.env.PORT || port)