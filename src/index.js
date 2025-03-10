const { ipcRenderer } = require('electron');

document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "192.168.137.98"; 

function send_data(keyCode) {
    const net = require('net');
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        ipcRenderer.send('log', 'connected to server');;
        client.write(`${keyCode}`);
    });

    client.on('end', () => {
        ipcRenderer.send('log', 'disconnected');;
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
    });
}

function update_display(data) {

    try {
        const jsonData = JSON.parse(data);
        // ipcRenderer.send('log', data);

        if (jsonData.direction) {
            document.getElementById("direction").innerHTML = jsonData.direction;
        }
        if (jsonData.speed) {
            document.getElementById("speed").innerHTML = jsonData.speed;
        }
        if (jsonData.distance) {
            document.getElementById("distance").innerHTML = jsonData.distance;
        }
        if (jsonData.temperature) {
            document.getElementById("temperature").innerHTML = jsonData.temperature;
        }
        if (jsonData.bluetooth) {
            document.getElementById("bluetooth").innerHTML = jsonData.bluetooth;
        }
    } catch (error) {
        console.error("Failed to parse server response:", error);
    }
}

function update_data() {
    const net = require('net');
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        client.write("get_status");
    });

    client.on('data', (data) => {
        const response = data.toString();
        console.log(response);
        update_display(response);
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });

    client.on('error', (err) => {
        ipcRenderer.send('log', err);;
    });
}

setInterval(update_data, 50);

function updateKey(e) {
    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_data("up");
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_data("down");
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_data("left");
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_data("right");
    }
    else if (e.keyCode == '32') {
        // space (stop)
        document.getElementById("stopButton").style.color = "red";
        send_data("stop");
    }
}

function resetKey(e) {
    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
    document.getElementById("stopButton").style.color = "red";
}