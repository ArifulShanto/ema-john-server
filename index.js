const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d7jvo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productsCollection = client.db(process.env.DB_NAME).collection("products");
  const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    // console.log(product);
    productsCollection.insertMany(products)
      .then(result => {
        res.send(result.insertedCount);
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/products/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })
  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.acknowledged);
      })
  })




});









app.get('/', (req, res) => {
  res.send('Hello Ema-John!')
})

app.listen(process.env.PORT || port)