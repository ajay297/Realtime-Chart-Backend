const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const index = require('./routes/index');
const test = require('./routes/test');

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
    console.log("New client connected"), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
    setTimeout(async () => {
        try {
            const res = await axios.get(
                "https://rest.coinapi.io/v1/exchangerate/ETH/USD?apikey=F0B54E31-62C7-47DD-9475-8ECFA656F071"
            ); // Getting the data from DarkSky
            const res1 = await axios.get(
                "https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=F0B54E31-62C7-47DD-9475-8ECFA656F071"
            );
            console.log(res.data);
            const data = { name: '', doge: res.data["rate"], btc: res1.data["rate"] };
            // for (var i = 0; i < data.length; i++) {
            //     rates.push({ name: "", value: data[i]["rate"] });
            // }
            console.log(data);
            socket.emit("FromAPI", data); // Emitting a new message. It will be consumed by the client
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }, 1000)
};

server.listen(5000, () => console.log('Server running at port 5000'));