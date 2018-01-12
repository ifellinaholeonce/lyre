const express = require('express');
const SocketServer = require('ws').Server;
const fetch = require("node-fetch");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});

// Function returns a promise that resolves to the videoId
function getVideosByArtistTitle(artist, title) {
  const API_KEY = "AIzaSyDVD-ryAY3Ug1UZXllgx3XHZQo6s0zxtJw";
  let artistSerial = artist.split(" ").join("+");
  let titleSerial = title.split(" ").join("+");
  let response = "";

  let path = `https://www.googleapis.com/youtube/v3/search?maxResults=1&part=snippet&q=${artistSerial}+${titleSerial}&key=${API_KEY}`;

  fetch(path)
    .then(function(res) {
        return res.json();
    }).then(function(body) {
      let videoId = body.items[0].id.videoId;
        console.log(videoId);
        return videoId;
    });
}

let artist = "Katy Perry";
let title = "Fireworks";

getVideosByArtistTitle(artist, title);