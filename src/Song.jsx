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
             <button className="btn btn-like" onClick={this.like}>Like</button>
          }
          <span>{this.props.song.score}</span>
          {this.props.song.liked === null && <span>|</span>}
          {!(this.props.song.liked === false) &&
             <button className="btn btn-skip" onClick={this.skip}>Skip</button>
          }
        </div>
      </div>
    );
  }

}
export default CurrentPlaying;
