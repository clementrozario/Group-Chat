// app.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const cors = require('cors');
const path=require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// Serve HTML files from the 'views' folder
app.use(express.static('./views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

// Routes
const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);

// Models
const User = require('./models/userModel');

// Sync and server start
sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => console.log(err));
