const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://007shojibkhan3:007shojibkhan3@cluster1.mhhrtuq.mongodb.net/?appName=Cluster1";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MovieMaster pro server is available')
})

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db('movie_master');
        const usersCollection = db.collection('users');
        const moviesCollection = db.collection('movies');

        // app.post('/users', async (req, res) => {
        //     const newUser = req.body;
        //     const email = req.body.email;
        //     const query = { email: email }
        //     const existingUser = await usersCollection.findOne(query);
        //     if (existingUser) {
        //         res.send({ message: 'user already exist' })
        //     } else {
        //         const result = await usersCollection.insertOne(newUser);
        //         res.send(result)
        //     }
        // })

        app.get('/movies', async (req, res) => {
            const cursor = moviesCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/movies/top-rated', async(req, res) => {
            const cursor = moviesCollection.find().sort({ rating: -1 }).limit(8);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/movies/recently-add', async(req, res) => {
            const cursor = moviesCollection.find().sort({ created_at: -1 }).limit(8);
            const result = await cursor.toArray();
            res.send(result)
        })

        // app.get('/all-products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await productsCollection.findOne(query)
        //     res.send(result)
        // })

        // bids collection........................


        // app.get('/all-products/bids/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { product: new ObjectId(id) }
        //     const cursor = bidsCollection.find(query).sort({ bid_price: -1 })
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })

        // app.get('/bids', async (req, res) => {
        //     const email = req.query.email;  // URL এর query থেকে email নিচ্ছে
        //     let query = {};

        //     if (email) {
        //         query = { bayer_email: email }; // শুধু ওই ইউজারের bids দেখাবে
        //     }

        //     const cursor = bidsCollection.find(query);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('MovieMaster pro server started on port:', port)
})