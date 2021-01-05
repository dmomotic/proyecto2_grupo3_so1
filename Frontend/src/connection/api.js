import socketIOClient from 'socket.io-client';


const ENDPOINT = "http://localhost:4001";
const cloudEndPoint = "https://websocketserver-bghiq22hva-uc.a.run.app";
var socket = socketIOClient(ENDPOINT);


let connect = (cb) => {
    console.log("Attempting Connection...");

    socket.connect(ENDPOINT);
    console.log(socket.connected)

        console.log("WEBSOCKET CONNECTED");
        socket.on("FromAPI", (data) => {
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

export { connect, adios };