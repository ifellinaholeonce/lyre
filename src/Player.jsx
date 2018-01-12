import React, {Component} from 'react';
import YouTube from 'react-youtube';

class Player extends Component {


  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
  return (
    <div style={{}}>
    <YouTube
      videoId={this.props.song.videoId}
      opts={opts}
      onEnd={this.props.nextSong}
    />
  </div>
  );}
}
export default Player;
