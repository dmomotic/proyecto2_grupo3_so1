import socketIOClient from 'socket.io-client';


const ENDPOINT = "http://localhost:4001";
const cloudEndPoint = "https://websocketserver-bghiq22hva-uc.a.run.app";
var socket = socketIOClient(ENDPOINT);



let connect = (cb) => {
    socket.connect(ENDPOINT);

    socket.on("FromAPI", (data) => {
        cb(data)
    });

};

let consulta2 = (cb) => {

    socket.on("consulta2", (data) => {
        cb(data)
    });

};

let adios = () => {
    console.log("Attempting Disconnection...");
    socket.disconnect();
    if (!socket.connected) {
        console.log("DISCONNECTED")
    }
}

export { connect, consulta2, adios };