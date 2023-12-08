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
const staticPath = path.join(__dirname, './views'); 
app.use(express.static(staticPath));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Models
const User = require('./models/userModel');
const Chat = require('./models/chatModel');

User.hasMany(Chat);
Chat.belongsTo(User);

// Sync and server start
sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => console.log(err));
