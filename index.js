const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@todo.ociza.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const toDoList = client.db("toDOTask").collection("tasks");

        app.post("/task", async (req, res) => {
            const myTask = req.body;
            const result = await toDoList.insertOne(myTask);
            res.send(result);
        })

        app.get("/mytask", async (req, res) => {
            const query = {};
            const cursor = toDoList.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.delete('/mytask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toDoList.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello From To Do App!");
})

app.listen(port, () => {
    console.log(`To Do app listening on port ${port}`);
})