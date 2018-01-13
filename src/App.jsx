import React, {Component} from 'react';
import CurrentPlaying from './CurrentPlaying.jsx';
import Bar from './Bar.jsx';
import Queue from './Queue.jsx';
import NavBar from './NavBar.jsx'


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      host: 0,
      room_id: "",
      currentSong: {title: "Metanoya", artist: "MGMT", score: 3, videoId: "2g811Eo7K8U"},
      queue: []
    }
  }

  componentDidMount = () => {
    //Connect to server once the component mounts
    this.connection = new WebSocket("ws://127.0.0.1:3001");
    this.connection.onopen = () => {
      console.log("Connected to server as:", this.state.currentUser);
    };
    this.connection.onmessage = (event) => {
      let message = JSON.parse(event.data);
      switch (message.type) {
        case "initHost":
          this.setState({
            host: message.host,
            room_id: message.room_id
          })
          break;
        case "receivingRequest":
          this.setState({
            queue: message.queue
          })
          break;
        case "receivingSongChange":
          this.setState({
            currentSong: message.currentSong,
            queue: message.queue
          })
        default:
          console.log("Unknown message")
      }
    }
  }

  sortQueue = () => {
    //sort queue by score in descending order
    let { queue } = this.state;
    queue.sort((a,b) => {
      return b.score - a.score
    })
    this.setState({queue})
  }

  nextSong = () => {
    //TAKE SONG WITH MOST VOTES FROM QUEUE AND SET TO CURRENT SONG
    //Get song with most votes from queue
    let { queue } = this.state;
    let nextSong = queue.shift();

    let message = {
      type: "incomingSongChange",
      room_id: this.state.room_id,
    }
    if (this.state.host) {
      this.connection.send(JSON.stringify(message))
    }
  }

//VOTING FOR SONGS - Might want to change to a switch case?
  like = (song) => {
    let { title } = song;
    if (title === this.state.currentSong.title) {
      let newScore = this.state.currentSong.score + 1;
      let { currentSong } = this.state;
      currentSong.score = newScore;
      currentSong.liked = true;
      this.setState({
        currentSong
      });
    } else {
      this.state.queue.forEach((track, i) => {
        if (title === track.title) {
          let { queue } = this.state;
          let newScore = track.score + 1;
          queue[i].score = newScore;
          queue[i].liked = true;
        }
      })
      this.sortQueue();
      this.setState({
        queue
      })
    }
  }

  skip = (song) => {
    let { title } = song;
    if (title === this.state.currentSong.title) {
      let newScore = this.state.currentSong.score - 1;
      let { currentSong } = this.state;
      currentSong.score = newScore;
      currentSong.liked = false;
      this.setState({
        currentSong
      });
    } else {
      let { queue } = this.state;
      queue.forEach((track, i) => {
        if (title === track.title) {
          let newScore = track.score - 1;
          queue[i].score = newScore;
          queue[i].liked = false;
        }
      });
      this.sortQueue();
      this.setState({
        queue
      });
    }
  }

  makeRequest = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let artist = e.target.artist.value;
    const newSong = {
      type: "incomingRequest",
      title,
      artist,
      score: 1,
      room_id: this.state.room_id
    }
    this.connection.send(JSON.stringify(newSong))
  }

  render() {
    return (
      <div>
        <NavBar />
        <CurrentPlaying
          host={this.state.host}
          like={this.like}
          skip={this.skip}
          currentSong={this.state.currentSong}
          queue={this.state.queue}
          nextSong={this.nextSong}
        />
        <Queue
          queue={this.state.queue}
          like={this.like}
          skip={this.skip}
        />
        <Bar
          makeRequest={this.makeRequest}
        />

      </div>
    );
  }
}
export default App;
