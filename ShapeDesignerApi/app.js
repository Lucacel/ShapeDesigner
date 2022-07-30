const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');


const app = express();
const port = 3000;

const socket = require("socket.io");
const { createShape } = require('./shapeService');

//Add middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = app.listen(port, function () {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});


app.use(express.static("public"));


//db connnection
let mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'shape_designer'
  })
  
connection.connect()

// Socket setup
const io = socket(server, {
    cors: {
        origin: "*"
    }
});

const shapesLimit = 10;

app.get('/shapes', (req, res) => {
    const sql = `SELECT x, y, label, shape_type AS shapeType FROM shapes ORDER BY idshapes DESC LIMIT ${shapesLimit}`;
    connection.query(sql, (err, result) => {
        if(!err) {
            console.log('shapes: ', result)
            res.send(result)
        } else {
            console.warn('ERROR: ', err)
        }
    })
})

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("message", function (data) {
        shape = createShape(data.x, data.y);
        const sql = `INSERT INTO shapes (x, y, label, shape_type) VALUES ("${shape.x}", "${shape.y}", "${shape.label}", "${shape.shapeType}")`
        connection.query(sql, (err, result) => {
            if(!err) {
                console.log('1 row inserted: ', result)
                io.emit("message", shape);
            } else {
                console.warn('ERROR: ', err);
            }
        })
    });

});