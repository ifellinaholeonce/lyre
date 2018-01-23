require('dotenv').config();

const express = require('express');
const SocketServer = require('ws');
const dotenv = require('dotenv').config();
const youtube = require('./youtube.js');
const utils = require('./utils.js');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

///////////////////////////////
////////////ROOMS//////////////
///////////////////////////////
let rooms = {};

//Initiate a new room
const initRoom = (host) => {
  let room_id = utils.generateRandomString(6, 'aA#');
  const room = {
    [room_id] :{
      room_id,
      guests: [host],
      currentSong: {},
      queue: []
    }
  }

  rooms = Object.assign(rooms, room);
  return room_id;
}

const joinRoom = (user, room) => {
  let message = {
    type: "receivingRoomJoin",
    room_id: room.room_id,
    currentSong: room.currentSong,
    queue: room.queue
  }
  rooms[room.room_id].guests.push(user)
  user.send(JSON.stringify(message));
}

//Initiate the host - this assigns them id 1 so that only they render the video and other content
const initHost = (host) => {
  let message = {
    type: "initHost",
    host: 1, //It is either 1 or 0. This is not an id number.
    room_id: initRoom(host)
  }
  host.send(JSON.stringify(message))
}

//This will broadcast messages to everyone connected
wss.broadcast = (message, guests) => {
  guests.forEach((client) => {
    if (client.readyState === SocketServer.OPEN){ //check that the websocket connection is open
      data = JSON.stringify(message); //stringify the data
      client.send(data);
    }
  })
}
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    message = JSON.parse(message); //immedaitely parse the data to json
    console.log("message", message)
      switch (message.type) {
      case "initHost":
        initHost(ws);
        break;
      case "incomingRequest":
        youtube.getVideosByArtistTitle(message.title, message.artist).then((id) => {
          message.videoId = id;
          let currentRoom = rooms[message.room_id];
          let { currentSong } = currentRoom;
          rooms[message.room_id].queue.push(message);
          //CHECK IF THE CURRENT SONG IS EMPTY AND PUT A SONG IN THE CURRENT PLAYING IF IT IS
          if (Object.keys(rooms[message.room_id].currentSong).length === 0) { //Should probably replace with underscore module's deep equals
            rooms[message.room_id].currentSong = rooms[message.room_id].queue.shift();
            response = {
              type: "receivingSongChange",
              currentSong: rooms[message.room_id].currentSong,
              queue: rooms[message.room_id].queue
            }
          } else {
            response = {
              type: "receivingRequest",
              queue: rooms[message.room_id].queue
            }
          }
          wss.broadcast(response, rooms[message.room_id].guests);
        });
        break;
      case "incomingSongChange":
        console.log("Incoming Song Change", message)
        let currentRoom = rooms[message.room_id];
        let { queue } = currentRoom;
        let nextSong = queue.shift();
        currentRoom.currentSong = nextSong;
        response = {
          type: "receivingSongChange",
          currentSong: currentRoom.currentSong,
          queue
        }
        wss.broadcast(response, rooms[message.room_id].guests);
        break;
      case "incomingRoomJoin":
        console.log("Joining room", message.room_id)
        let { room_id } = message;
        joinRoom(ws, rooms[room_id]);
        break;
      case "upVoteQueueSong":
        console.log("upVoteQueueSong", message)
        currentRoom = rooms[message.room_id];
        queue = currentRoom.queue;
        queue.forEach((song) => {
          if (message.song.name === song.name) { //should probably user underscore's deep equal here
            song.score++;
          }
        })
        break;
      }

  })

  ws.on('error', (error) => {
    console.log(error);
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});
