require('dotenv').config();

const express = require('express');
const SocketServer = require('ws');
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();


// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

// Function returns a promise that resolves to the videoId
function getVideosByArtistTitle(artist, title) {
  const API_KEY = process.env.API_KEY;
  let artistSerial = artist.split(" ").join("+");
  let titleSerial = title.split(" ").join("+");
  let response = "";

  let path = `https://www.googleapis.com/youtube/v3/search?maxResults=1&part=snippet&q=${artistSerial}+${titleSerial}&key=${API_KEY}`;

  return fetch(path)
    .then(function(res) {
        return res.json();
    }).then(function(body) {
      let videoId = body.items[0].id.videoId;
      console.log(body);
      console.log(videoId);
      return videoId;
    });
}
///////////////////////////////
////////////ROOMS//////////////
///////////////////////////////
const rooms = [];
//Initiate a new room
const initRoom = (host) => {
  const room = {
    id: 1, //muse uuidv4 to give id numbers
    host,
    guests: [],
    currentSong: {},
    queue: []
  }
  rooms.push(room);
  return room.id
}

//Initiate the host - this assigns them id 1 so that only they render the video and other content
const initHost = (host) => {
  let message = {
    type: "initHost",
    host: 1, //It is either 1 or 0. This is not an id number.
    room_id: initRoom(host)
  }
  host.host = true
  console.log(host.host)
  console.log("sending", message)
  host.send(JSON.stringify(message))
}

const lookupRoom = (lookupId) => {
  let result = {}
  rooms.forEach((room) => {
    if (room.id === lookupId) {
      result = room
    }
  });
  return result;
}

//This will broadcast messages to everyone connected
wss.broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === SocketServer.OPEN){ //check that the websocket connection is open
      data = JSON.stringify(message); //stringify the data
      client.send(data);
      console.log(data);
    }
  })
}
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  if (wss.clients.size === 1) {
    initHost(ws);
  }
  ws.on('message', function incoming(message) {
    message = JSON.parse(message); //immedaitely parse the data to json
      switch (message.type) {
      case "incomingRequest":
        getVideosByArtistTitle(message.title, message.artist).then((id) => {
          message.videoId = id;
          let currentRoom = lookupRoom(message.room_id)
          currentRoom.queue.push(message)
          message = {
            type: "receivingRequest",
            queue: currentRoom.queue
          }
          wss.broadcast(message);
        });
        break;
      case "incomingSongChange":
        let currentRoom = lookupRoom(message.room_id);
        let { queue } = currentRoom;
        let nextSong = queue.shift();
        currentRoom.currentSong = nextSong;
        message = {
          type: "receivingSongChange",
          currentSong: currentRoom.currentSong,
          queue
        }
        wss.broadcast(message);
        break;
      }
  })

  ws.on('error', (error) => {
    console.log(error);
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});
