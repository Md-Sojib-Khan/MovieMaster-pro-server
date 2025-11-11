const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const wishlistCollection = db.collection('wishlist');

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                res.send({ message: 'user already exist' })
            } else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result)
            }
        })

        // app.get('/movies', async (req, res) => {
        //     const cursor = moviesCollection.find().sort({ created_at: -1 });
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })
        app.get('/movies', async (req, res) => {
            const email = req.query.email;
            let query = {};

            if (email) {
                query = { addedBy: email };
            }

            const cursor = moviesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/movies/top-rated', async (req, res) => {
            const cursor = moviesCollection.find().sort({ rating: -1 }).limit(8);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/movies/recently-add', async (req, res) => {
            const cursor = moviesCollection.find().sort({ created_at: -1 }).limit(8);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/movies/action', async (req, res) => {
            const cursor = moviesCollection.find({
                genre: { $in: ['Action'] }
            }).sort({ rating: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/movies/drama', async (req, res) => {
            const cursor = moviesCollection.find({
                genre: { $in: ['Drama'] }
            }).sort({ rating: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await moviesCollection.findOne(query)
            res.send(result)
        })

        app.post('/movies', async (req, res) => {
            const newMovie = req.body;
            const result = await moviesCollection.insertOne(newMovie);
            res.send(result)
        })

        app.put('/movies/update/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: data
            }
            const result = await moviesCollection.updateOne(query, update)
            res.send(result)
        })

        app.delete('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await moviesCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/wishlist', async (req, res) => {
            const data = req.body;
            const result = await wishlistCollection.insertOne(data)
            res.send(result)
        })

        app.get('/wishlist', async (req, res) => {
            const email = req.query.email;
            let query = {};

            if (email) {
                query = { wishlist_by: email };
            }

            const cursor = wishlistCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: (id) }
            const result = await wishlistCollection.deleteOne(query)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('MovieMaster pro server started on port:', port)
})