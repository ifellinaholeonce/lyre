const fetch = require('node-fetch');


// Function returns a promise that resolves to the videoId
getVideosByArtistTitle = function(artist, title) {
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

module.exports = {
  getVideosByArtistTitle: getVideosByArtistTitle
}
