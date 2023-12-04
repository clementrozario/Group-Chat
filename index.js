const express = require('express');
const cors = require('cors');
const path = require('path');

const sequelize = require('./utils/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);


// Serve HTML files from the 'views' folder
app.use(express.static(path.join(__dirname, 'views')));


sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error(err));
