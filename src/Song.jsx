import React, {Component} from 'react';
import Song from './Song.jsx'


class CurrentPlaying extends Component {
  like = (e) => {
    this.props.like(this.props.song)
  }

  skip = (e) => {
    console.log("The song being passed:", this.props.song)
    this.props.skip(this.props.song)
  }
  render() {
    return (
      <div>
        <div className="song-title">
          <span>Title:</span>
          <span>{this.props.song.title}</span>
        </div>
        <div className="song-artist">
          <span>Artist:</span>
          <span>{this.props.song.artist}</span>
        </div>
        <div>
          <span>Vote: </span>
          {!(this.props.song.liked) &&
             <button onClick={this.like}>Like</button>
          }
          {this.props.song.liked === null && <span>|</span>}
          {!(this.props.song.liked === false) &&
             <button onClick={this.skip}>Skip</button>
          }
          <h3>{this.props.song.score}</h3>
        </div>
      </div>
    );
  }

}
export default CurrentPlaying;
