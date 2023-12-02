const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const routes = require('./routes/routes');
const cors = require('cors');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers for JSON and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());

// Define static path (if needed)
const staticPath = path.resolve(__dirname, './views');
app.use(express.static(staticPath));

// Routes setup
app.use('/', routes);

// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
