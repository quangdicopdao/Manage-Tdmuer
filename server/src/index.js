// app.js
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const db = require('./config/db');
const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
db.connect()
    .then(() => {
        //home
        app.use('/', siteRoutes);
        //schedule
        app.use('/schedule', scheduleRoutes);

        //register
        app.use('/v1/auth', authRoutes);
        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
