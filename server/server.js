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
        return videoId;
    });
}
// Function generates a random alpha numeric string, with specified length
let generateRandomString = (length, chars) => {
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += mask[Math.round(Math.random() * (mask.length - 1))];
  }
  return result;
};
///////////////////////////////
////////////ROOMS//////////////
///////////////////////////////
let rooms = {};

//Initiate a new room
const initRoom = (host) => {
  let room_id = generateRandomString(6, 'aA#');
  const room = {
    [room_id] :{
      room_id,
      guests: [host],
      currentSong: {},
      queue: []
    }
  }

  rooms = Object.assign(rooms, room);
  return room_id
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

const lookupRoom = (lookupId) => {
  let result = rooms[lookupId]
  //if resuslt is still empty should throw an error
  return result;
}

const joinRoom = (user, room_id) => {
  let room = lookupRoom(room_id)
  let message = {
    type: "receivingRoomJoin",
    room_id: room.room_id,
    currentSong: room.currentSong,
    queue: room.queue
  }
  rooms[room_id].guests.push(user)
  user.send(JSON.stringify(message));
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
    let queueRoom;
      switch (message.type) {
      case "initHost":
        initHost(ws);
        break;
      case "incomingRequest":
        getVideosByArtistTitle(message.title, message.artist).then((id) => {
          message.videoId = id;
          let currentRoom = rooms[message.room_id];
          let { currentSong } = currentRoom;
          delete message.type
          rooms[message.room_id].queue.push(message);
          //CHECK IF THE CURRENT SONG IS EMPTY AND PUT A SONG IN THE CURRENT PLAYING IF IT IS
          if (Object.keys(rooms[message.room_id].currentSong).length === 0) {
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
        let currentRoom = lookupRoom(message.room_id);
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
        joinRoom(ws, room_id);
        break;
      case "upVoteQueueSong":
        queueRoom = lookupRoom(message.room_id);
        queueRoom.queue.forEach((song) => {
          if (message.song.name === song.name) { //should probably user underscore's deep equal here
            song.score++;
          }
        });
        response = {
          type: "receivingQueueVotes",
          queue: queueRoom.queue
        }
        wss.broadcast(response, rooms[message.room_id].guests)
        break;
        case "downVoteQueueSong":
          queueRoom = lookupRoom(message.room_id);
          queueRoom.queue.forEach((song) => {
            if (message.song.name === song.name) { //should probably user underscore's deep equal here
              song.score--;
            }
          });
          response = {
            type: "receivingQueueVotes",
            queue: queueRoom.queue
          }
          wss.broadcast(response, rooms[message.room_id].guests)
          break;
      }

  })

  ws.on('error', (error) => {
    console.log(error);
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});
