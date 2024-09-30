const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => { console.log('Connection to MongoDB established.')},
        err => { console.log('Failed to connect to MongoDB.')}
    );

const user = require('./routes/user.routes');

app.use('/api/user', user);
// app.use('/api/products', product);

app.listen(port, () => {
    console.log("Server is up.");
});
