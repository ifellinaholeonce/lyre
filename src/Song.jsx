import React, {Component} from 'react';
import Song from './Song.jsx'


class CurrentPlaying extends Component {
  like = (e) => {
    this.props.like(this.props.song)
    e.target.setAttribute('disabled', 'disabled');
  }

  skip = (e) => {
    this.props.skip(this.props.song)
    e.target.setAttribute('disabled', 'disabled');
  }
  render() {
    return (
      <div>
        <div>
          <span>Title:</span>
          <span>{this.props.song.title}</span>
        </div>
        <div>
          <span>Artist:</span>
          <span>{this.props.song.artist}</span>
        </div>
        <div>
          <span>Vote: </span>
          <button onClick={this.like}>Like</button> | <button onClick={this.skip}>Skip</button>
          <h3>{this.props.song.score}</h3>
        </div>
      </div>
    );
  }

}
export default CurrentPlaying;
