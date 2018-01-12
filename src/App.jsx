import React, {Component} from 'react';
import CurrentPlaying from './CurrentPlaying.jsx';
import Bar from './Bar.jsx';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSong: {title: "Metanoya", artist: "MGMT", score: 3, videoId: "2g811Eo7K8U"},
      queue: [{title: "Superman", artist: "Goldfinger", score: 1, videoId: "WEkSYw3o5is"}, {title: "The Hands That Be", artist: "Street Light Manifesto", score: 1, videoId: "_teB4ujKzdE"}]
    }
  }

  nextSong = () => {
    //TAKE SONG WITH MOST VOTES FROM QUEUE AND SET TO CURRENT SONG
    //Get song with most votes from queue
    let { queue } = this.state;
    let nextSong = queue[0];
    queue.forEach((song) => {
      if (song.score > nextSong.score) {
        nextSong = song;
      }
      this.setState({currentSong: nextSong})
    })
  }

//VOTING FOR SONGS - Might want to change to a switch case?
  like = (song) => {
    let { title } = song;
    if (title === this.state.currentSong.title) {
      let newScore = this.state.currentSong.score + 1;
      let { currentSong } = this.state;
      currentSong.score = newScore
      this.setState({
        currentSong
      });
    } else {
      this.state.queue.forEach((track, i) => {
        if (title === track.title) {
          let queue = this.state.queue;
          let newScore = track.score + 1;
          queue[i].score = newScore;
          this.setState({
            queue
          })
        }
      })
    }
  }

  skip = (song) => {
    let { title } = song;
    if (title === this.state.currentSong.title) {
      let newScore = this.state.currentSong.score - 1;
      let { currentSong } = this.state;
      currentSong.score = newScore
      this.setState({
        currentSong
      });
    } else {
      this.state.queue.forEach((track, i) => {
        if (title === track.title) {
          let queue = this.state.queue;
          let newScore = track.score - 1;
          queue[i].score = newScore;
          this.setState({
            queue
          })
        }
      })
    }
  }

  makeRequest = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let artist = e.target.artist.value;
    const newSong = {
      title,
      artist,
      score: 1
    }
    let queue = this.state.queue;
    queue.push(newSong);
    this.setState({
      queue
    })
  }

  render() {
    return (
      <div>
        <CurrentPlaying
          like={this.like}
          skip={this.skip}
          currentSong={this.state.currentSong}
          queue={this.state.queue}
          nextSong={this.nextSong}
        />
        <Bar
          makeRequest={this.makeRequest}
        />

      </div>
    );
  }
}
export default App;
