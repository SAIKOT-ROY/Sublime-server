const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());
// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndhwlcd.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const flightInfoCollection = client.db("modals_data").collection("flightsInfo");
    const vacationInfoCollection = client.db("modals_data").collection("vacationInfo");
    const aiGenerateCollection = client.db("modals_data").collection("aiGeneratePackage");

    app.post("/flights", async (req, res) => {
      const addFlightsInfo = req.body;
      const result = await flightInfoCollection.insertOne(addFlightsInfo);
      res.send(result);
    });

    app.post("/vacations", async (req, res) => {
      const addVacationsInfo = req.body;
      const result = await vacationInfoCollection.insertOne(addVacationsInfo);
      res.send(result);
    });

    app.get("/flights", async (req, res) => {
      const result = await flightInfoCollection.find().toArray();
      res.send(result);
    });

    app.get("/vacations", async (req, res) => {
      const result = await vacationInfoCollection.find().toArray();
      res.send(result);
    });

    app.get("/aiPackage", async (req, res) => {
      const result = await aiGenerateCollection.find().toArray();
      res.send(result);
    });


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


app.get("/", (req, res) => {
  res.send("Hello from sublime server");
});

app.listen(port, () => {
  console.log(`Sublime Server is running on ${port}`);
});
