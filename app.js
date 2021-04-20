const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const PORT = process.env.PORT || 5000;

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
                "https://rest.coinapi.io/v1/exchangerate/ETH/USD?apikey=57E5962D-A44E-4890-99BB-9031885ACB40"
            ); // Getting the data from DarkSky
            const res1 = await axios.get(
                "https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=57E5962D-A44E-4890-99BB-9031885ACB40"
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

server.listen(PORT, () => console.log(`Server running at port ${PORT}`));