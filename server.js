const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

async function connectToMongoDB(data) {
  const uri = 'mongodb://localhost:27017/personal-budget';
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();

    console.log('Connected to MongoDB');

    // Insert the data into the 'budget-data' collection
    const result = await client.db('personal-budget').collection('budget-data').insertOne(data);
    console.log('Data inserted successfully');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

app.get('/budget', async (req, res) => {
  try {
    const uri = 'mongodb://localhost:27017/personal-budget';
    const client = new MongoClient(uri);

    await client.connect();

    console.log('Connected to MongoDB');

    // Retrieve data from the 'budget-data' collection
    const budgets = await client.db('personal-budget').collection('budget-data').find().toArray();
    res.send(budgets);

    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    res.status(500).send("Error retrieving budget data");
  }
});

app.post('/budget', async (req, res) => {
  try {
    // Connect to MongoDB and insert data
    await connectToMongoDB(req.body);
    res.send("Data inserted successfully");
  } catch (error) {
    res.status(500).send("Error saving budget data");
  }
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
