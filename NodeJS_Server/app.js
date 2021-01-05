const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "https://proyecto2.g3sopes1.tk",
    methods: ["GET", "POST"]
  }
});

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const url2= 'mongodb+srv://admin:admin123@cluster0.4d9ky.mongodb.net/testdb?retryWrites=true&w=majority'


let interval;

io.on("connection", (socket) => {
  console.log("New user connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 8000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

});


const getApiAndEmit = (socket) => {
  //const response = new Date();
  // Emitting a new message. Will be consumed by the client

  let r=[];
  let datosmongo=[];
  MongoClient.connect(url2, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      return console.log(err);
    }
  
    // Specify database you want to access
    const db = client.db('testdb');
    const casos = db.collection('users');

    //const db = client.db('g3sopes1');
    //const casos = db.collection('casos');
  
  
    console.log(`MongoDB Connected: ${url2}`);

    let infofinal= [];
  


    //REPORTE TOP 3 DEPARTAMENTOS
    casos.aggregate([ { $group : { _id : "$location", count: {$sum:1} } },{$sort:{count:-1}},{$limit:3} ] ).toArray((err, results) => {
      //console.log(results);
      //r.push(results);
      socket.emit("FromAPI", results);
    });


    //REPORTE PORCENTAJE DE INFECTADOS POR DEPARTAMENTO
    casos.aggregate([ { $group : { _id : "$location", value: {$sum:1} } },{$sort:{value:-1}}, {$project:{name:"$_id",_id:false, value:"$value"}} ]).toArray((err, results) => {
      //console.log(results);
      //r.push(results);
      socket.emit("consulta2", results);
    });

  
    //client.close();
  
  });


  //socket.emit("FromAPI", r);
};


server.listen(port, () => console.log(`Listening on port ${port}`));