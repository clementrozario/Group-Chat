require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database')
const http = require('http');
const app = express();

const server = http.createServer(app);
const socketIo = require('socket.io');
const io = require('socket.io')(server);


io.on('connection', (socket) => {
    socket.on('join-group', (groupId) => {
        socket.join(groupId);
    });

    socket.on('user-message', (data) => {
        const { groupId, message } = data;
        
        // Broadcast the message to all clients in the group
        io.to(groupId).emit('message', message);
    });
});


app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

var cors = require('cors');
app.use(cors({
    origin: 'http://127.0.0.1:5500',
}));

const User = require('./models/userModel');
const Chat = require('./models/chatModel');
const Group = require('./models/groupModel');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');

const staticPath = path.join(__dirname, "./views")
app.use(express.static(staticPath));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' });
User.belongsToMany(Group, { through: 'group_users' });
Group.belongsToMany(User, { through: 'group_users' });

sequelize
    // .sync({force: true})
    .sync()
    .then(()=> {
        return Group.findByPk(1);
    })
    .then(group => {
        if (!group) {
            return Group.create({groupname: "Main Group"});
        }
        return group;
    })
    .then(result => {
        server.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err))